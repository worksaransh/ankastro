<?php

namespace App\Services;

use GuzzleHttp\Client;
use Exception;

class PythonIntelligenceBridge
{
    protected Client $client;
    protected string $baseUrl;
    protected string $secretKey;

    public function __construct()
    {
        $this->baseUrl = env('PYTHON_ENGINE_URL', 'http://localhost:8000/api/v1');
        $this->secretKey = env('INTERNAL_API_SECRET', 'ankjyotish_super_secret_internal_key_2026');
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'timeout'  => 30.0,
            'headers'  => [
                'X-Internal-Secret' => $this->secretKey,
                'Content-Type'      => 'application/json',
                'Accept'            => 'application/json',
            ],
        ]);
    }

    public function calculateNumerology(array $profileData): array
    {
        try {
            $response = $this->client->post('calculate/numerology', [
                'json' => $profileData,
            ]);
            return json_decode($response->getBody()->getContents(), true);
        } catch (Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }
    }

    public function calculateAstrology(array $profileData): array
    {
        try {
            $response = $this->client->post('calculate/astrology', [
                'json' => $profileData,
            ]);
            return json_decode($response->getBody()->getContents(), true);
        } catch (Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }
    }

    public function synthesizeInterpretation(array $payload): array
    {
        try {
            $response = $this->client->post('interpret', [
                'json' => $payload,
            ]);
            return json_decode($response->getBody()->getContents(), true);
        } catch (Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }
    }

    public function getRecommendations(array $payload): array
    {
        try {
            $response = $this->client->post('recommend', [
                'json' => $payload,
            ]);
            return json_decode($response->getBody()->getContents(), true);
        } catch (Exception $e) {
            return [];
        }
    }
}
