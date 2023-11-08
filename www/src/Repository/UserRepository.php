<?php

namespace App\Repository;

use App\Dto\LoginResponseDto;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function saveLoginSession(string $username, LoginResponseDto $loginResponseDto, ?int $memberId): void
    {
        $user = $this->findOneBy(['username' => $username]);

        if (!$user) {
            $user = (new User())
                ->setUsername($username);
        }

        $user->setCurrentSessionKey($loginResponseDto->sessionKey)
            ->setEmail($loginResponseDto->email)
            ->setFirstName($loginResponseDto->firstName)
            ->setLastName($loginResponseDto->surname)
            ->setMembershipId($memberId)
            ->setNewPasswordRequired($loginResponseDto->newPasswordRequired)
            ->setPersonId($loginResponseDto->userId);

        $this->save($user, true);
    }
}
