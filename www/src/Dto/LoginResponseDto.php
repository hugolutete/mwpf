<?php

namespace App\Dto;

use function Symfony\Component\String\u;

final readonly class LoginResponseDto
{
    public function __construct(
        private bool    $authenticated,
        private ?string $message,
        public string   $firstName,
        public string   $surname,
        public string   $email,
        public string   $sessionKey,
        public int      $userId,
        public bool     $newPasswordRequired)
    {
    }

    public function isSuccess(): bool
    {
        return $this->authenticated && $this->userId > 0;
    }

    public function error(): string
    {
        return u($this->message)->trim()->toString();
    }

//"Authenticated" => true
//"NewPasswordRequired" => false
//"Message" => null
//"FirstName" => "TOMAS"
//"Surname" => "CHIHUNGULE"
//"EmailAddress" => null
//"SessionKey" => "4C5AB43F-AE07-4E39-871D-2A0F024E32B8"
//"UserID" => 876882
}