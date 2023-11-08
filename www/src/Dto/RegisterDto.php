<?php

namespace App\Dto;

use Misd\PhoneNumberBundle\Validator\Constraints\PhoneNumber;
use Symfony\Component\Validator\Constraints\GreaterThan;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

final class RegisterDto
{
    public function __construct(
        #[NotBlank]
        #[Length(max: 150)]
        public ?string $surname = null,

        #[NotBlank]
        #[GreaterThan(0)]
        public ?int    $memberId = null,

        #[NotBlank]
        #[Length(min: 10, max: 10)]
        #[PhoneNumber(defaultRegion: 'ZA')]
        public ?string $cellphone = null,
    )
    {
    }
}