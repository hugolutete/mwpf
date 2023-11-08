<?php

namespace App\Controller;

use App\Dto\PasswordUpdateDto;
use App\Dto\VerifyMemberRequestDto;
use App\Entity\User;
use App\Event\PasswordUpdatedEvent;
use App\Repository\UserRepository;
use App\Service\MwpfClient;
use App\Service\TouchTexterClient;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

#[Route('/api', name: 'api_')]
final class ApiController extends AbstractController
{
    public function __construct(
        private readonly MwpfClient               $mwpfClient,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly TouchTexterClient        $texterClient,
        private readonly ValidatorInterface       $validator,
        private readonly UserRepository           $repository,
        private readonly LoggerInterface          $logger)
    {
    }

    #[Route('/forgot_password.json', name: 'forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request, MwpfClient $mwpfClient): JsonResponse
    {
        try {
            if ($this->getUser()) {
                throw $this->createAccessDeniedException(sprintf('You are already signed in as %s', $this->getUser()->getUserIdentifier()));
            }

            $data = json_decode($request->getContent(), true);

            $username = $data['username'];

            // todo: validate this input

            if (!$username) {
                return $this->json('Username must not be empty.', Response::HTTP_BAD_REQUEST);
            }

            $message = $mwpfClient->forgotPassword(username: $username);

            return $this->json($message, Response::HTTP_OK);
        } catch (\Throwable $throwable) {
            return $this->json($throwable->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/verify_member.json', name: 'verify_member', methods: ['POST'])]
    public function verifyMember(Request $request, SerializerInterface $serializer): JsonResponse
    {
        try {
            if ($this->getUser()) {
                throw $this->createAccessDeniedException(sprintf('You are already signed in as %s', $this->getUser()->getUserIdentifier()));
            }

            $requestDto = $serializer->deserialize(data: $request->getContent(), type: VerifyMemberRequestDto::class, format: 'json');

            $errors = $this->validator->validate($requestDto);

            if (count($errors)) {
                return $this->json(data: (string)$errors, status: Response::HTTP_BAD_REQUEST);
            }

            $responseDto = $this->mwpfClient->verifyMember(dto: $requestDto);

            return $this->json(data: $responseDto, status: Response::HTTP_CREATED);
        } catch (\Throwable $exception) {
            return $this->json(data: $exception->getMessage(), status: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/register.json', name: 'register', methods: ['POST'])]
    public function register(Request $request, SerializerInterface $serializer): JsonResponse
    {
        try {
            if ($this->getUser()) {
                throw $this->createAccessDeniedException(sprintf('You are already signed in as %s', $this->getUser()->getUserIdentifier()));
            }

            $requestDto = $serializer->deserialize(data: $request->getContent(), type: VerifyMemberRequestDto::class, format: 'json');

            $errors = $this->validator->validate($requestDto);

            if (count($errors)) {
                return $this->json(data: (string)$errors, status: Response::HTTP_BAD_REQUEST);
            }

            $responseDto = $this->mwpfClient->registerMember(dto: $requestDto);

            try {
                // save this user to the database
                $user = (new User())
                    ->setUsername($responseDto->username)
                    ->setCellphone($requestDto->Cellphone)
                    ->setPersonId($responseDto->userId)
                    ->setTemporaryPassword($responseDto->temporaryPassword)
                    ->setTemporaryPasswordCreatedAt(new \DateTimeImmutable());

                $this->repository->save($user, true);
            } catch (\Throwable $exception) {
                $this->logger->error($exception->getMessage());
            }

            try {
                $message = "Hi. Please use the following to login\nUsername : $responseDto->username \nTemporary Password : $responseDto->temporaryPassword";

                $reference = $this->texterClient->sendTextMessage(phone: $requestDto->Cellphone, message: $message, verboseResponse: false);

                $this->addFlash('success', "Your registration was successful, an sms will be sent shortly");
            } catch (\Throwable $exception) {
                $this->logger->error($exception->getMessage());
            }

            return $this->json(data: $responseDto, status: Response::HTTP_CREATED);
        } catch (\Throwable $exception) {
            return $this->json(data: $exception->getMessage(), status: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[IsGranted(User::ROLE_USER)]
    #[Route('/update_password.json', name: 'update_password', methods: ['POST'])]
    public function updatePassword(Request $request, #[CurrentUser] User $user): JsonResponse
    {
        try {
            $body = json_decode($request->getContent(), true);

            $passwordDto = new PasswordUpdateDto(
                password: $body['password'] ?? '',
                cellphone: $body['cellphone'] ?? '',
            );

            $errors = $this->validator->validate($passwordDto);

            if (count($errors)) {
                return $this->json((string)$errors, Response::HTTP_BAD_REQUEST);
            }

            $success = $this->mwpfClient->updatePassword(user: $user, passwordRequestDto: $passwordDto);

            if ($success === true) {
                $this->eventDispatcher->dispatch(new PasswordUpdatedEvent(cellphone: $passwordDto->cellphone));

                // send sms
                try {
                    $this->texterClient->sendPasswordDetails(passwordDto: $passwordDto);

                    return $this->json("Password successfully updated and an SMS was sent to $passwordDto->cellphone", Response::HTTP_OK);
                } catch (\Throwable $exception) {
                    return $this->json("Password was successfully updated but the following error was encountered whilst sending out the SMS: {$exception->getMessage()}", Response::HTTP_OK);
                }
            }

            return $this->json([], Response::HTTP_BAD_REQUEST);
        } catch (\Throwable $exception) {
            return $this->json($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[IsGranted(User::ROLE_USER)]
    #[Route('/investment_info.json', name: 'investment_info', methods: ['GET'])]
    public function investmentInfo(#[CurrentUser] User $user): JsonResponse
    {
        $dto = $this->mwpfClient->getInvestmentInfo($user);

        if (!$dto) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        return $this->json($dto);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[IsGranted(User::ROLE_USER)]
    #[Route('/contribution_rate.json', name: 'contribution_rate', methods: ['GET'])]
    public function contributionRate(#[CurrentUser] User $user): JsonResponse
    {
        $dto = $this->mwpfClient->getContributionRate($user);

        if (!$dto) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        return $this->json($dto);
    }

    /**
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[IsGranted(User::ROLE_USER)]
    #[Route('/nominated_beneficiaries.json', name: 'nominated_beneficiaries', methods: ['GET'])]
    public function nominatedBeneficiaries(#[CurrentUser] User $user): JsonResponse
    {
        $beneficiaries = iterator_to_array($this->mwpfClient->getNominatedBeneficiaries($user));

        if (!count($beneficiaries)) {
            return $this->json([], Response::HTTP_OK);
        }

        return $this->json($beneficiaries);
    }

    #[IsGranted(User::ROLE_USER)]
    #[Route('/claim_status.json', name: 'claim_status', methods: ['GET'])]
    public function claimStatus(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json([]);
    }

    #[IsGranted(User::ROLE_USER)]
    #[Route('/nomination_form.json', name: 'nomination_form', methods: ['GET'])]
    public function nominationForm(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json([]);
    }

    #[IsGranted(User::ROLE_USER)]
    #[Route('/unclaimed_benefits.json', name: 'unclaimed_benefits', methods: ['GET'])]
    public function unclaimedBenefits(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json([]);
    }
}