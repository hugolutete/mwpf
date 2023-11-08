<?php

namespace App\Controller;

use App\Dto\ContactFormDto;
use App\Form\ContactFormType;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

final class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home_alt__', methods: ['GET'])]
    #[Route('/index.html', name: 'app_home', methods: ['GET'])]
    #[Route(path: '/login', name: 'app_login')]
    public function index(AuthenticationUtils $authenticationUtils): Response
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        if ($error) {
            $this->addFlash('error', $error->getMessage());
        }

        return $this->render('home/index.html.twig', ['last_username' => $lastUsername, 'error' => $error?->getMessage()]);
    }

    #[Route('/complaint.html', name: 'app_complaint', methods: ['GET'])]
    public function complaint(): Response
    {
        return $this->render('home/complaint.html.twig');
    }

    #[Route('/contact.html', name: 'app_contact', methods: ['GET', 'POST'])]
    public function contact(Request $request, MailerInterface $mailer, string $mailerFromAddress, string $mailerToAddress, LoggerInterface $logger): Response
    {
        $dto = new ContactFormDto();

        $form = $this->createForm(ContactFormType::class, $dto);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $message = <<<TEXT
From:   {$dto->getEmail()}
Name: {$dto->getName()}
Email: {$dto->getName()}
Message: {$dto->getMessage()}
TEXT;

                $email = (new Email())
                    ->subject('Contact Form Message')
                    ->from($mailerFromAddress)
                    ->to($mailerToAddress)
                    ->replyTo($dto->getEmail())
                    ->text($message);

                $mailer->send($email);

                $this->addFlash('success', 'Your email was successfully sent, we will get in touch shortly!');

                return $this->redirectToRoute('app_contact');
            } catch (\Throwable $exception) {
                $this->addFlash('error', $exception->getMessage());
                $logger->error($exception->getMessage());
            }
        }

        return $this->render('home/contact.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
