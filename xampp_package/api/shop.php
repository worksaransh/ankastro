<?php
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? 'products';

if ($action === 'products') {
    if ($pdo) {
        $stmt = $pdo->query("SELECT * FROM products WHERE is_active = 1 ORDER BY is_featured DESC, base_price ASC");
        $products = $stmt->fetchAll();
    } else {
        $products = [];
    }

    echo json_encode([
        'success' => true,
        'count' => count($products),
        'products' => $products
    ]);
    exit();
}

if ($action === 'create_order') {
    $input = json_decode(file_get_contents('php://input'), true);

    $orderNumber = 'ORD-' . strtoupper(bin2hex(random_bytes(4)));
    $customerName = trim($input['name'] ?? '');
    $customerEmail = trim($input['email'] ?? '');
    $customerPhone = trim($input['phone'] ?? '');
    $address = json_encode($input['address'] ?? []);
    $subtotal = (float)($input['subtotal'] ?? 0);
    $discount = (float)($input['discount'] ?? 0);
    $couponCode = trim($input['coupon_code'] ?? '');
    $totalAmount = max(0, $subtotal - $discount);

    if ($pdo) {
        $stmt = $pdo->prepare("
            INSERT INTO ecommerce_orders (
                id, order_number, customer_name, customer_email, customer_phone,
                shipping_address, subtotal, discount, coupon_code, total_amount,
                payment_status, fulfillment_status, created_at
            ) VALUES (
                UUID(), :order_number, :customer_name, :customer_email, :customer_phone,
                :shipping_address, :subtotal, :discount, :coupon_code, :total_amount,
                'paid', 'processing', NOW()
            )
        ");
        $stmt->execute([
            ':order_number' => $orderNumber,
            ':customer_name' => $customerName,
            ':customer_email' => $customerEmail,
            ':customer_phone' => $customerPhone,
            ':shipping_address' => $address,
            ':subtotal' => $subtotal,
            ':discount' => $discount,
            ':coupon_code' => $couponCode,
            ':total_amount' => $totalAmount
        ]);
    }

    echo json_encode([
        'success' => true,
        'order_number' => $orderNumber,
        'total_amount' => $totalAmount,
        'message' => 'Order created successfully in XAMPP MySQL database.'
    ]);
    exit();
}
