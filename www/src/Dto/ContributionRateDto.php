<?php

namespace App\Dto;

final class ContributionRateDto
{
    public function __construct(
        public string  $eeRate,
        public string  $eeDeemedRate,
        public string  $erRate,
        public string  $eeFixed,
        public string  $eeDeemedFixed,
        public string  $erFixed,
        public ?string $fromAge,
        public ?string $toAge,
        public string  $escPercentage,
        public string  $escDate,
        public string  $effectiveDate,
    )
    {

    }

    //        "$type" => "EBSphere.Service.Models.MemberContributionsRate, EBSphere.Service"
//    "MemberID" => "751237"
//    "EERate" => ""
//    "EEDeemedRate" => ""
//    "ERRate" => ""
//    "EEFixed" => "273.28"
//    "EEDeemedFixed" => ""
//    "ERFixed" => "688.69"
//    "FromAge" => null
//    "ToAge" => null
//    "EscPercentage" => ""
//    "EscDate" => ""
//    "EffectiveDate" => "01/10/2022 12:00:00 AM"
}