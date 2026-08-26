<?php

namespace App\Services;

interface PaymentGatewayInterface
{
    /**
     * Create an order session on the payment gateway.
     */
    public function createOrder(string $orderId, float $amount, string $currency, array $customer, array $metadata = []): array;

    /**
     * Verify payment status directly with the gateway or via webhook payload.
     */
    public function verifyPayment(string $paymentId, ?string $signature = null): array;

    /**
     * Process refund for an existing transaction.
     */
    public function processRefund(string $paymentId, float $amount, string $reason): array;
}
