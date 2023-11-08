<?php

namespace App\Dto;

use Misd\PhoneNumberBundle\Validator\Constraints\PhoneNumber;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class VerifyMemberRequestDto
{
    public function __construct(
        #[NotBlank]
        #[Length(max: 200)]
        public ?string $LookUpValue = null,

        #[NotBlank]
        #[Length(max: 200)]
        public ?string $Surname = null,

        #[NotBlank]
        #[Length(min: 10, max: 10)]
        #[PhoneNumber(defaultRegion: 'ZA')]
        public ?string $Cellphone = null,
    )
    {
    }
}