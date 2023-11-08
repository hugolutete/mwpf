<?php

namespace App\EventSubscriber;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Event\LogoutEvent;

final readonly class LogoutEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private UserRepository $repository)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            LogoutEvent::class => 'onLogout',
        ];
    }

    public function onLogout(LogoutEvent $event): void
    {
        $user = $event->getToken()->getUser();

        if (!$user instanceof User) {
            dd($user);
            return;
        }

        $user->setCurrentSessionKey(null);
        $this->repository->save($user, true);
    }
}