<?php

namespace App\Event;

final readonly class PasswordUpdatedEvent
{
    public function __construct(public string $cellphone)
    {

    }
}