<?php

namespace App\Dto;

final readonly class NominatedBeneficiaryDto
{
    public function __construct(
        public ?string $effectiveDate,
        public ?string $firstName,
        public ?string $surname,
        public ?string $idNumber,
        public ?string $dateOfBirth,
        public ?string $gender,
        public ?string $phoneNumber,
        public ?string $address,
        public ?string $bankAccount,
        public ?string $bankAccountHolder,
        public ?string $branchCode,
        public ?string $branchName,
        public ?string $bankName,
        public ?string $beneficiaryType,
        public ?string $percentage,
    )
    {
    }
}