<?php

namespace App\EventSubscriber;

use App\Entity\User;
use App\Entity\UserSession;
use App\Repository\UserSessionRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\FlashBagAwareSessionInterface;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;

final readonly class LoginEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private UserSessionRepository $sessionRepository, private RequestStack $requestStack)
    {
    }


    public static function getSubscribedEvents(): array
    {
        return [
            LoginSuccessEvent::class => 'onLoginSuccess',
        ];
    }

    public function onLoginSuccess(LoginSuccessEvent $event): void
    {
        $user = $event->getUser();

        if (!$user instanceof User) {
            return;
        }

        if (!$user->getCurrentSessionKey()) {
            throw new \RuntimeException('Session key is not set.');
        }

        $sessionEntity = (new UserSession())
            ->setUser($user)
            ->setSessionKey($user->getCurrentSessionKey());

        $this->sessionRepository->save($sessionEntity, true);

        $session = $this->requestStack->getCurrentRequest();

        if ($session instanceof FlashBagAwareSessionInterface) {
            $session->getFlashBag()->set('success', 'You have successfully signed in.');
            dd($session);
        }
    }
}