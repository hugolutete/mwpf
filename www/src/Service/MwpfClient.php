<?php

namespace App\Service;

use App\Dto\ContributionRateDto;
use App\Dto\InvestmentResponseDto;
use App\Dto\LoginResponseDto;
use App\Dto\NominatedBeneficiaryDto;
use App\Dto\PasswordUpdateDto;
use App\Dto\PersonalDetailsResponseDto;
use App\Dto\RegisterMemberResponseDto;
use App\Dto\VerifyMemberRequestDto;
use App\Dto\VerifyMemberResponseDto;
use App\Entity\User;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use function Symfony\Component\String\u;

/**
 * API Documentation: https://mobileua.mwpf.co.za/help
 */
final readonly class MwpfClient
{
    const FUND_NAME = 'Mineworkers Provident Fund';

    private HttpClientInterface $httpClient;

    public function __construct(
        private UserRepository    $userRepository,
        private TouchTexterClient $texterClient,
        private LoggerInterface   $logger,
        private string            $mwpfApiBaseUrl)
    {
        $this->httpClient = HttpClient::create([
            'verify_host' => false,
            'verify_peer' => false,
        ]);
    }

    public function login(string $username, string $password): LoginResponseDto
    {
        try {
            // 1. get username
            // 2. get password
            // 3. login
            // 4. on success, get membership id
            // 5. save local profile
            // 6. return success

            $response = $this->httpClient->request(
                method: 'POST',
                url: "$this->mwpfApiBaseUrl/LoginV2",
                options: [
                    'body' => [
                        'username' => $username,
                        'password' => $password,
                    ],
                    'verify_host' => false,
                    'verify_peer' => false,
                ],
            );

            $data = $response->toArray();

            //"Authenticated" => true
            //"NewPasswordRequired" => false
            //"Message" => null
            //"FirstName" => "TOMAS"
            //"Surname" => "CHIHUNGULE"
            //"EmailAddress" => null
            //"SessionKey" => "4C5AB43F-AE07-4E39-871D-2A0F024E32B8"
            //"UserID" => 876882

            return new LoginResponseDto(
                authenticated: $data['Authenticated'] ?? false,
                message: $data['Message'] ?? '',
                firstName: $data['FirstName'] ?? '',
                surname: $data['Surname'] ?? '',
                email: $data['EmailAddress'] ?? '',
                sessionKey: $data['SessionKey'] ?? '',
                userId: intval($data['UserID'] ?? 0),
                newPasswordRequired: $data['NewPasswordRequired'] ?? false,
            );
        } catch (\Throwable $exception) {
            $this->logger->error($exception->getMessage());

            return new LoginResponseDto(
                authenticated: false,
                message: $exception->getMessage(),
                firstName: '',
                surname: '',
                email: '',
                sessionKey: '',
                userId: 0,
                newPasswordRequired: false,
            );
        }
    }

    public function getMemberId(string $sessionId, int $personId): null|int|false
    {
        try {
            $response = $this->httpClient->request('GET', "$this->mwpfApiBaseUrl/Investments?sessionKey={$sessionId}&personId={$personId}");

            $funds = $response->toArray()['Funds'] ?? [];

            foreach ($funds as $item) {
                if (u($item['FundName'])->trim()->upper()->toString() === strtoupper(self::FUND_NAME)) {
                    return intval($item['MemberId'] ?? 0);
                }
            }

            return null;
        } catch (\Throwable $exception) {
            $this->logger->error($exception->getMessage());
            return false;
        }
    }

    /**
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getPersonalDetails(User $user): PersonalDetailsResponseDto|false
    {
        try {
            if (!$user->getMembershipId()) {
                return false;
            }

            // api/PersonalDetails?sessionKey={sessionKey}&memberID={memberID}&userID={userID}
            $response = $this->httpClient->request('GET', "$this->mwpfApiBaseUrl/PersonalDetails?sessionKey={$user->getCurrentSessionKey()}&memberID={$user->getMembershipId()}&userID={$user->getPersonId()}");

            $data = $response->toArray();

//        "Id" => 716337
//      "MemberNo" => "00001910"
//      "Surname" => "CHIHUNGULE"
//      "Firstname" => "TOMAS"
//      "DateOfBirth" => "22/05/1967"
//      "IDNumber" => ""
//      "DateJoinedFund" => "01/02/2020"
//      "DatePensionableService" => ""
//      "NormalRetirementDate" => "31/05/2027"
//      "DateOfExit" => ""
//      "EmployerName" => "Umusa Mining"
//      "PayPointName" => "UM - UMUSA MINING  (221221)"

            return new PersonalDetailsResponseDto(
                id: $data['Id'],
                memberNumber: $data['MemberNo'],
                firstName: $data['Firstname'],
                surname: $data['Surname'],
                dateOfBirth: $data['DateOfBirth'],
                idNumber: $data['IDNumber'],
                dateJoinedFund: $data['DateJoinedFund'],
                datePensionableService: $data['DatePensionableService'],
                normalRetirementDate: $data['NormalRetirementDate'],
                dateOfExit: $data['DateOfExit'],
                employerName: $data['EmployerName'],
                payPointName: $data['PayPointName'],
            );
        } catch (\Throwable $exception) {
            $this->logger->error($exception->getMessage());
            return false;
        }
    }

    public function updatePassword(User $user, PasswordUpdateDto $passwordRequestDto): true|string
    {
        try {
            // api/UpdatePassword
            $response = $this->httpClient->request(method: 'POST', url: "$this->mwpfApiBaseUrl/updatePassword", options: [
                'body' => json_encode([
                    'SessionKey' => $user->getCurrentSessionKey(),
                    'UserID' => $user->getPersonId(),
                    'Password' => $passwordRequestDto->password,
                    'Cellphone' => $passwordRequestDto->cellphone,
                ]), // apparently you need to also encode the body, in addition to the json content type header :(
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]);

            $data = $response->toArray();

            // "$type" => "EBSphere.Mobile.Shared.Models.UpdatePasswordResponseModel, EBSphere.Mobile.Shared"
            //  "Success" => true
            //  "Message" => "Your password has been updated successfully."

            if ($data['Success']) {
                return true;
            }

            return $data['Message'];
        } catch (\Throwable $exception) {
            $this->logger->error($exception->getMessage());
            return $exception->getMessage();
        }
    }

    public function getBenefitStatement(User $user): string|false
    {
        try {
            // api/BenefitStatementBase64?sessionKey={sessionKey}&memberID={memberID}
            $response = $this->httpClient->request(
                method: 'GET',
                url: "$this->mwpfApiBaseUrl/BenefitStatementBase64?SessionKey={$user->getCurrentSessionKey()}&memberID={$user->getMembershipId()}",
            );

            $data = $response->toArray();

            return $data['FileImage']['$value'];
        } catch (\Throwable $exception) {
            $this->logger->error($exception->getMessage());
            return false;
        }
    }

    /**
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getInvestmentInfo(User $user): InvestmentResponseDto|false
    {
        try {
            $response = $this->httpClient->request(
                method: 'GET',
                url: "$this->mwpfApiBaseUrl/SelectInvestment?SessionKey={$user->getCurrentSessionKey()}&memberID={$user->getMembershipId()}",
            );

            $data = $response->toArray();

            if (!$data['Success'] && is_array($data['Investments'] ?? null)) {
                return false;
            }

            return new InvestmentResponseDto(
                product: $data['Investments'][0]['Product'] ?? '',
                units: $data['Investments'][0]['Units'] ?? '',
                price: $data['Investments'][0]['Price'] ?? '',
                value: $data['Investments'][0]['Value'] ?? '',
                date: $data['Investments'][0]['InvestmentDate'] ?? '',
            );
        } catch (\Throwable $exception) {
            $this->logger->error($exception->getMessage());
            return false;
        }

        //"$type" => "EBSphere.Service.Models.SelectInvestmentResult, EBSphere.Service"
//"CurrentTotalValue" => "R17,916.80"
//"Investments" => array:1 [▼
//0 => array:8 [▼
//"$type" => "EBSphere.Service.Models.SelectInvestment, EBSphere.Service"
//"Product" => "AA (General) Portfolio"
//"Units" => 53.3507
//"ShowUnits" => false
//"Price" => 337.5417
//"ShowPrice" => false
//"Value" => "R  17,916.80"
//"InvestmentDate" => "09/07/2023"
//]
//]
//"Success" => true
//"SessionExpired" => false
//"Message" => ""
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getContributionRate(User $user): false|ContributionRateDto
    {
        try {
            // ContributionsRate
            $response = $this->httpClient->request(
                method: 'GET',
                url: "$this->mwpfApiBaseUrl/ContributionsRate?SessionKey={$user->getCurrentSessionKey()}&memberID={$user->getMembershipId()}",
            );

            $data = $response->toArray();

            if (empty($data)) {
                return false;
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

            return new ContributionRateDto(
                eeRate: $data[0]['EERate'] ?? '',
                eeDeemedRate: $data[0]['EEDeemedRate'] ?? '',
                erRate: $data[0]['ERRate'] ?? '',
                eeFixed: $data[0]['EEFixed'] ?? '',
                eeDeemedFixed: $data[0]['EEDeemedFixed'] ?? '',
                erFixed: $data[0]['ERFixed'] ?? '',
                fromAge: $data[0]['FromAge'] ?? '',
                toAge: $data[0]['ToAge'] ?? '',
                escPercentage: $data[0]['EscPercentage'] ?? '',
                escDate: $data[0]['EscDate'] ?? '',
                effectiveDate: $data[0]['EffectiveDate'] ?? '',
            );
        } catch (\Throwable $exception) {
            $this->logger->error($exception->getMessage());
            return false;
        }
    }

    public function getNominatedBeneficiaries(User $user): iterable
    {
        try {
            // GET api/NominatedBeneficiaries?memberID={memberID}&sessionKey={sessionKey}&userID={userID}
            // ContributionsRate
            $response = $this->httpClient->request(
                method: 'GET',
                url: "$this->mwpfApiBaseUrl/NominatedBeneficiaries?SessionKey={$user->getCurrentSessionKey()}&memberID={$user->getMembershipId()}&userID={$user->getPersonId()}",
            );

            $data = $response->toArray();

            if (empty($data)) {
                return [];
            }

            foreach ($data as $item) {
                // <a href="#">EffectiveDate: </a>' + dat.EffectiveDate + '<br><a href="#">Firstname: </a>' + dat.Firstname + '<br><a href="#">Surname: </a>'
                // + dat.Surname + '<br><a href="#">IDNumber: </a>' + dat.IDNumber + '<br/><br/><a href="#">DateOfBirth: </a>' + dat.DateOfBirth
                // + '<br><a href="#">Gender: </a>' + dat.Gender + '<br><a href="#">Phonenumber: </a>' + dat.Phonenumber + '<br><a href="#">Address: </a>'
                // + dat.Address + '<br><a href="#">BankAccount: </a>' + dat.BankAccount + '<br><a href="#">BankAccountHolder: </a>' + dat.BankAccountHolder
                // + '<br><a href="#">BranchCode: </a>' + dat.BranchCode + '<br><a href="#">BranchName: </a>' + dat.BranchName + '<br><a href="#">BankName: </a>'
                // + dat.BankName + '<br><a href="#">BeneficiaryType: </a>' + dat.BeneficiaryType + '<br><a href="#">Percentage: </a>' + dat.Percentage
                // + '<br><h3>----------------------------------------------</h3><br>
                yield new NominatedBeneficiaryDto(
                    effectiveDate: $item['EffectiveDate'] ?? '',
                    firstName: $item['Firstname'] ?? '',
                    surname: $item['Surname'] ?? '',
                    idNumber: $item['IDNumber'] ?? '',
                    dateOfBirth: $item['DateOfBirth'] ?? '',
                    gender: $item['Gender'] ?? '',
                    phoneNumber: $item['Phonenumber'] ?? '',
                    address: $item['Address'] ?? '',
                    bankAccount: $item['BankAccount'] ?? '',
                    bankAccountHolder: $item['BankAccountHolder'] ?? '',
                    branchCode: $item['BranchCode'] ?? '',
                    branchName: $item['BranchName'] ?? '',
                    bankName: $item['BankName'] ?? '',
                    beneficiaryType: $item['BeneficiaryType'] ?? '',
                    percentage: $item['Percentage'] ?? '',
                );
            }
        } catch (\Throwable $exception) {
            $this->logger->error($exception->getMessage());
        }
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function forgotPassword(string $username): string
    {
        // POST api/ForgotPassword
        // @see https://mobileua.mwpf.co.za/Help/Api/POST-api-ForgotPassword
        $response = $this->httpClient->request(
            method: 'POST',
            url: "$this->mwpfApiBaseUrl/ForgotPassword",
            options: [
                'body' => json_encode([
                    'UserInput' => $username,
                    'SendSMS' => false,
                    'SendEmail' => false,
                ]),
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ],
        );

        $result = $response->toArray();

//        {
//            "$type": "EBSphere.Mobile.Shared.Models.ForgotPasswordResponseModel, EBSphere.Mobile.Shared",
//            "Success": false,
//            "Message": "An error has ocurred whilst resetting your password. Please contact your administrator.",
//            "Cellphone": null,
//            "Password": null
//        }

        // OR

//        {
//            "$type": "EBSphere.Mobile.Shared.Models.ForgotPasswordResponseModel, EBSphere.Mobile.Shared",
//            "Success": true,
//            "Message": "You will shortly receive correspondence with your new temporary password. Should you not receive this please contact your administrator.",
//            "Cellphone": "0671393434",
//            "Password": "hzcWGiYjd7"
//        }

        if (!$result['Success'] ?? false) {
            throw new \RuntimeException($result['Message'] ?? 'An error occurred whilst trying to reset your password.');
        }

        $cellphone = $result['Cellphone'];
        $password = $result['Password']; // this is a temporary password

        $user = $this->userRepository->findOneBy(['username' => $username]);

        if (!$user) {
            $user = (new User())
                ->setUsername($username);
        }

        $user->setCellphone($cellphone)
            ->setTemporaryPasswordCreatedAt(new \DateTimeImmutable())
            ->setTemporaryPassword($password);

        $this->userRepository->save($user, true);

        try {
            if ($cellphone && $password) {
                $message = "Hi, please use the following password to login to the mobile app. Password : " . $password;

                $this->texterClient->sendTextMessage(phone: $cellphone, message: $message, verboseResponse: false);

                // todo: Notify site administrator
            }
        } catch (\Throwable $exception) {
            $this->logger->error($exception->getMessage());
            $this->logger->error($exception->getTraceAsString());
        }

        return $result['Message'];
    }

    /**
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     */
    public function verifyMember(VerifyMemberRequestDto $dto): VerifyMemberResponseDto
    {
        // POST api/VerifyMember
        $response = $this->httpClient->request(
            method: 'POST',
            url: "$this->mwpfApiBaseUrl/VerifyMember",
            options: [
                'body' => json_encode([
                    'LookUpValue' => $dto->LookUpValue,
                    'Surname' => $dto->Surname,
                ]),
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ],
        );

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

        $result = $response->toArray();

        if (!$result['Success'] ?? false) {
            throw new \RuntimeException($result['Message'] ?? 'An error was encountered when verifying member details');
        }

        $userId = intval($result['UserID'][0] ?? null);

        if (empty($userId)) {
            throw new \RuntimeException('Your profile could not be validated - userID returned null. Contact your administrator for further assistance.');
        }

        return new VerifyMemberResponseDto(userId: $userId, clients: $result['Client']);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function registerMember(VerifyMemberRequestDto $dto): RegisterMemberResponseDto
    {
        $member = $this->verifyMember(dto: $dto);

        // if we have a userId, then ask for generation of account
        // GET api/GenerateUsernamePassword?userID={userID}
        $response = $this->httpClient->request('GET', "$this->mwpfApiBaseUrl/GenerateUsernamePassword?userID={$member->getUserId()}");

        $result = $response->toArray();

        if ($result['Success'] !== true) {
            throw new \RuntimeException($result['Message'] ?? 'An error was encountered when verifying member details');
        }

        $username = $result['UserName'] ?? null;
        $password = $result['Password'] ?? null;

        if (empty($username) || empty($password)) {
            throw new \LogicException($result['Message'] ?? 'Failed to retrieve your credentials');
        }

        return new RegisterMemberResponseDto(userId: ($result['UserID'][0] ?? null), username: $username, temporaryPassword: $password);
    }
}