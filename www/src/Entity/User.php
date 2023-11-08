<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Misd\PhoneNumberBundle\Validator\Constraints\PhoneNumber;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints\Length;
use function Symfony\Component\String\u;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface
{
    const ROLE_USER = 'ROLE_USER';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(name: 'username', length: 180, unique: true)]
    private ?string $username = null;

    #[ORM\Column(name: 'person_id', unique: true, nullable: true)]
    private ?int $personId = null;

    #[ORM\Column(name: 'membership_id', unique: true, nullable: true)]
    private ?int $membershipId = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: UserSession::class)]
    private Collection $sessions;

    #[ORM\Column(name: 'current_session_key', length: 50, nullable: true)]
    private ?string $currentSessionKey = null;

    #[ORM\Column(name: 'first_name', length: 150, nullable: true)]
    private ?string $firstName = null;

    #[ORM\Column(name: 'last_name', length: 150, nullable: true)]
    private ?string $lastName = null;

    #[ORM\Column(name: 'email', length: 180, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(name: 'cellphone', length: 10, nullable: true)]
    #[Length(min: 10, max: 10)]
    #[PhoneNumber(defaultRegion: 'ZA')]
    private ?string $cellphone = null;

    #[ORM\Column(name: 'temporary_password', length: 50, nullable: true)]
    private ?string $temporaryPassword = null;

    #[ORM\Column(name: 'temporary_password_created_at', nullable: true)]
    private ?\DateTimeImmutable $temporaryPasswordCreatedAt = null;

    #[ORM\Column(name: 'new_password_required', nullable: true)]
    private ?bool $newPasswordRequired = null;

    public function __construct()
    {
        $this->sessions = new ArrayCollection();
    }

    public function __toString(): string
    {
        $name = u("{$this->getFirstName()} {$this->getLastName()}")->trim()->toString();

        if ($name) {
            return $name;
        }

        return (string)$this->getUsername();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        // guarantee every user at least has ROLE_USER
        $roles[] = self::ROLE_USER;

        return array_unique($roles);
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getPersonId(): ?int
    {
        return $this->personId;
    }

    public function setPersonId(?int $personId): static
    {
        $this->personId = $personId;

        return $this;
    }

    public function getMembershipId(): ?int
    {
        return $this->membershipId;
    }

    public function setMembershipId(?int $membershipId): static
    {
        $this->membershipId = $membershipId;

        return $this;
    }

    /**
     * @return Collection<int, UserSession>
     */
    public function getSessions(): Collection
    {
        return $this->sessions;
    }

    public function addSession(UserSession $session): static
    {
        if (!$this->sessions->contains($session)) {
            $this->sessions->add($session);
            $session->setUser($this);
        }

        return $this;
    }

    public function removeSession(UserSession $session): static
    {
        if ($this->sessions->removeElement($session)) {
            // set the owning side to null (unless already changed)
            if ($session->getUser() === $this) {
                $session->setUser(null);
            }
        }

        return $this;
    }

    public function getCurrentSessionKey(): ?string
    {
        return $this->currentSessionKey;
    }

    public function setCurrentSessionKey(?string $currentSessionKey): static
    {
        $this->currentSessionKey = $currentSessionKey;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getCellphone(): ?string
    {
        return $this->cellphone;
    }

    public function setCellphone(?string $cellphone): static
    {
        $this->cellphone = $cellphone;

        return $this;
    }

    public function getTemporaryPassword(): ?string
    {
        return $this->temporaryPassword;
    }

    public function setTemporaryPassword(?string $temporaryPassword): static
    {
        $this->temporaryPassword = $temporaryPassword;

        return $this;
    }

    public function getTemporaryPasswordCreatedAt(): ?\DateTimeImmutable
    {
        return $this->temporaryPasswordCreatedAt;
    }

    public function setTemporaryPasswordCreatedAt(?\DateTimeImmutable $temporaryPasswordCreatedAt): static
    {
        $this->temporaryPasswordCreatedAt = $temporaryPasswordCreatedAt;

        return $this;
    }

    public function isNewPasswordRequired(): ?bool
    {
        return $this->newPasswordRequired;
    }

    public function setNewPasswordRequired(?bool $newPasswordRequired): static
    {
        $this->newPasswordRequired = $newPasswordRequired;

        return $this;
    }
}
