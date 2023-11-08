<?php

namespace App\Twig\Runtime;

use Twig\Extension\RuntimeExtensionInterface;

final readonly class AppExtensionRuntime implements RuntimeExtensionInterface
{
    public function __construct(private string $appName)
    {
        // Inject dependencies if needed
    }

    public function getAppName(): string
    {
        return $this->appName;
    }
}
