<?php

namespace App\Controller;

use App\Dto\PasswordUpdateDto;
use App\Entity\User;
use App\Form\UpdatePasswordType;
use App\Repository\UserRepository;
use App\Service\MwpfClient;
use App\Service\TouchTexterClient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;

#[IsGranted(User::ROLE_USER)]
final class ProfileController extends AbstractController
{
    public function __construct(private readonly MwpfClient $mwpfClient, private readonly TouchTexterClient $texterClient)
    {
    }

    /**
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/profile.html', name: 'app_profile', methods: ['GET', 'POST'])]
    public function index(#[CurrentUser] User $user, Request $request, UserRepository $repository): Response
    {
        $personalDetailsDto = $this->mwpfClient->getPersonalDetails(user: $user);

        $updatePasswordForm = $this->createForm(UpdatePasswordType::class);

        if ($user->isNewPasswordRequired()) {
            $passwordDto = new PasswordUpdateDto(cellphone: $user->getCellphone());

            $form = $this->createForm(UpdatePasswordType::class, $passwordDto);
            $form->handleRequest($request);

            if (!$form->isSubmitted()) {
                $this->addFlash('success', "You need to update your password first before you may proceed.");
            }

            if ($form->isSubmitted() && $form->isValid()) {
                $message = $this->mwpfClient->updatePassword(user: $user, passwordRequestDto: $passwordDto);

                if ($message === true) {
                    try {
                        $user->setNewPasswordRequired(false);

                        $repository->save($user, true);

                        $this->texterClient->sendPasswordDetails(passwordDto: $passwordDto);

                        $this->addFlash('success', 'Your password was successfully changed and an SMS was sent to ' . $passwordDto->cellphone);
                    } catch (\Throwable $exception) {
                        $this->addFlash('success', $exception->getMessage());
                    }

                    return $this->redirectToRoute('app_profile');
                } else {
                    $this->addFlash('error', $message);
                }
            }

            return $this->render('profile/password_change.html.twig', [
                'form' => $form->createView(),
            ]);
        }

        return $this->render('profile/index.html.twig', [
            'profile' => $personalDetailsDto,
            'updatePasswordForm' => $updatePasswordForm->createView(),
        ]);
    }

    #[Route('/download-benefits-statement', name: 'app_download_benefits_statement')]
    public function downloadBenefitsStatement(#[CurrentUser] User $user): BinaryFileResponse|RedirectResponse
    {
        $contents = $this->mwpfClient->getBenefitStatement(user: $user);

        if ($contents === false) {
            $this->addFlash('error', "Your benefits statement could not be generated.");

            return $this->redirectToRoute('app_profile');
        }

        $filesystem = new Filesystem();
        $filename = $filesystem->tempnam(sys_get_temp_dir(), uniqid(), '.pdf');

        file_put_contents($filename, base64_decode($contents));

        return $this->file(
            file: $filename,
            fileName: "{$user->getMembershipId()}.pdf",
            disposition: 'attachment',
        );
    }
}