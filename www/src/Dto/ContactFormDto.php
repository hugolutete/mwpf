<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

final class ContactFormDto
{
    public function __construct(
        #[NotBlank]
        #[Length(max: 200)]
        private ?string $name = null,

        #[NotBlank]
        #[Email]
        #[Length(max: 200)]
        private ?string $email = null,

        #[NotBlank]
        #[Length(max: 1024)]
        private ?string $message = null)
    {
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string|null $name
     * @return ContactFormDto
     */
    public function setName(?string $name): ContactFormDto
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string|null $email
     * @return ContactFormDto
     */
    public function setEmail(?string $email): ContactFormDto
    {
        $this->email = $email;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getMessage(): ?string
    {
        return $this->message;
    }

    /**
     * @param string|null $message
     * @return ContactFormDto
     */
    public function setMessage(?string $message): ContactFormDto
    {
        $this->message = $message;
        return $this;
    }
}