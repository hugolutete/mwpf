<?php

namespace App\Dto;

final readonly class VerifyMemberResponseDto
{
//        {
//            "$type": "EBSphere.Mobile.Shared.Models.VerifyMemberResponseModel, EBSphere.Mobile.Shared",
//            "Success": true,
//            "Message": "",
//            "UserID": [
//                    33
//                ],
//            "Client": [
//                {
//                    "Key": "Sibanye Gold",
//                    "Value": false
//                },
//                {
//                    "Key": "Anglogold Ashanti",
//                    "Value": false
//                },
//                {
//                    "Key": "South Deep Gold Mine",
//                    "Value": false
//                },
//                {
//                    "Key": "Harmony",
//                    "Value": false
//                },
//                {
//                    "Key": "Demo Employer Group",
//                    "Value": true
//                }
//            ]
//        }

    public function __construct(private ?int $userId, private array $clients)
    {
    }

    /**
     * @return int|null
     */
    public function getUserId(): ?int
    {
        return $this->userId;
    }

    /**
     * @return array
     */
    public function getClients(): array
    {
        return $this->clients;
    }
}