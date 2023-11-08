<?php

namespace App\Dto;

final readonly class InvestmentResponseDto
{
    public function __construct(
        public string $product,
        public float  $units,
        public float  $price,
        public string $value,
        public string $date,
    )
    {
    }
}