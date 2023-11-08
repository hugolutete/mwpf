<?php

namespace App\Dto;

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

final class RegisterMemberResponseDto
{
    public function __construct(
        public ?int    $userId = null,
        public ?string $username = null,
        public ?string $temporaryPassword = null,
    )
    {
    }
}