<?php

namespace App\Dto;

use Misd\PhoneNumberBundle\Validator\Constraints\PhoneNumber;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

final class PasswordUpdateDto
{
    public function __construct(
        #[NotBlank]
        #[Length(min: 6, max: 150)]
        public ?string $password = null,

        #[NotBlank]
        #[Length(min: 10, max: 10)]
        #[PhoneNumber(defaultRegion: 'ZA')]
        public ?string $cellphone = null)
    {
    }
}