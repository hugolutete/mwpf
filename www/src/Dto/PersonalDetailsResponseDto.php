<?php

namespace App\Dto;

use function Symfony\Component\String\u;

final readonly class PersonalDetailsResponseDto
{
    public function __construct(
        public ?int    $id,
        public ?string $memberNumber,
        public ?string $firstName,
        public ?string $surname,
        public ?string $dateOfBirth,
        public ?string $idNumber,
        public ?string $dateJoinedFund,
        public ?string $datePensionableService,
        public ?string $normalRetirementDate,
        public ?string $dateOfExit,
        public ?string $employerName,
        public ?string $payPointName)
    {
    }

    public function getName(): string
    {
        return u("$this->firstName $this->surname")->trim()->toString();
    }
}