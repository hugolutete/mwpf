<?php

namespace App\Service;

use App\Dto\PasswordUpdateDto;
use App\Event\PasswordUpdatedEvent;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use function Symfony\Component\String\u;

final readonly class TouchTexterClient
{
    public function __construct(
        private string                   $smsApiBaseUrl,
        private string                   $smsUsername,
        private string                   $smsPassword,
        private EventDispatcherInterface $eventDispatcher,
        private HttpClientInterface      $httpClient)
    {
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    private function getSessionToken(): string|false
    {
        $response = $this->httpClient->request(
            method: 'GET',
            url: "$this->smsApiBaseUrl/Logon?UserId=$this->smsUsername&Password=$this->smsPassword",
        );

        $data = explode("=", u($response->getContent())->trim()->toString());

        return $data[1] ?? false;
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function sendTextMessage(string $phone, string $message, bool $verboseResponse): string
    {
        $token = $this->getSessionToken();

        if (!$token) {
            throw new \RuntimeException('Failed to sign in to the text message service.');
        }

        // 'SessionID=' . $tken . '&PhoneNumber=' . $phoneNumber.'&MessageText=' . urlencode($messageText)
        $url = "$this->smsApiBaseUrl/Submit?SessionID=$token&PhoneNumber=$phone&MessageText=" . urlencode($message);

        $response = $this->httpClient->request(method: 'GET', url: $url);

        $data = [];

        // Success&MessageReference=500370016124843416&PhoneNumber=+27797894931&Credits=49858
        parse_str($response->getContent(), $data);

        if (!array_key_exists("Success", $data)) {
            throw new \RuntimeException($response->getContent());
        }

        if (!$verboseResponse) {
            return $data['MessageReference'];
        }

        return "MessageReference={$data['MessageReference']}; PhoneNumber={$data['PhoneNumber']}; Credits={$data['Credits']}";
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function sendPasswordDetails(PasswordUpdateDto $passwordDto): void
    {
        $this->eventDispatcher->dispatch(new PasswordUpdatedEvent(cellphone: $passwordDto->cellphone));

        $message = "Hi, please use the following password to login to the mobile app. Password : " . $passwordDto->password;

        $this->sendTextMessage(phone: $passwordDto->cellphone, message: $message, verboseResponse: false);
    }
}