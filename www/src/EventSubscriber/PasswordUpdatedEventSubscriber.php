<?php

namespace App\EventSubscriber;

use App\Entity\User;
use App\Event\PasswordUpdatedEvent;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use function Symfony\Component\String\u;

final readonly class PasswordUpdatedEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security, private UserRepository $repository)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            PasswordUpdatedEvent::class => 'onPasswordUpdated',
        ];
    }

    public function onPasswordUpdated(PasswordUpdatedEvent $event): void
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            return;
        }

        if (u($user->getCellphone())->trim()->lower()->toString() === u($event->cellphone)->trim()->lower()->toString()) {
            return;
        }

        $user->setCellphone(u($event->cellphone)->trim()->toString());

        $this->repository->save($user, true);
    }
}