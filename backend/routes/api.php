<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| AnkJyotish AI — API Routes Architecture
|--------------------------------------------------------------------------
*/

// Public Health & Diagnostics
Route::get('/health', function () {
    return response()->json([
        'status' => 'operational',
        'platform' => 'AnkJyotish AI Universal Platform',
        'version' => '2.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Public Calculation & Exploration APIs
Route::prefix('v1')->group(function () {
    Route::post('/calculate/numerology', 'App\Http\Controllers\CalculationController@calculateNumerology');
    Route::post('/calculate/astrology', 'App\Http\Controllers\CalculationController@calculateAstrology');
    Route::get('/compatibility/check', 'App\Http\Controllers\CalculationController@checkCompatibility');
    Route::get('/panchang/daily', 'App\Http\Controllers\CalculationController@getDailyPanchang');

    // E-Commerce & T-Shirts Catalog
    Route::prefix('shop')->group(function () {
        Route::get('/products', 'App\Http\Controllers\CommerceController@getProducts');
        Route::get('/products/{slug}', 'App\Http\Controllers\CommerceController@getProductDetail');
        Route::post('/cart/validate', 'App\Http\Controllers\CommerceController@validateCart');
        Route::post('/checkout/create-order', 'App\Http\Controllers\CommerceController@createOrder');
    });

    // Affiliate Link Redirection & Conversion Tracking
    Route::prefix('affiliate')->group(function () {
        Route::get('/redirect/{slug}', 'App\Http\Controllers\AffiliateController@handleRedirect');
        Route::post('/track-conversion', 'App\Http\Controllers\AffiliateController@trackConversion');
    });

    // Reports Catalog & Free Sample
    Route::prefix('reports')->group(function () {
        Route::get('/catalog', 'App\Http\Controllers\ReportController@getCatalog');
        Route::post('/preview', 'App\Http\Controllers\ReportController@previewFreeReport');
    });
});

// Authenticated User APIs (Sanctum protected)
Route::middleware(['auth:sanctum'])->prefix('v1/user')->group(function () {
    Route::get('/profile', 'App\Http\Controllers\UserController@getProfile');
    Route::put('/profile', 'App\Http\Controllers\UserController@updateProfile');
    Route::get('/dashboard/summary', 'App\Http\Controllers\UserController@getDashboardSummary');
    Route::get('/reports', 'App\Http\Controllers\ReportController@getUserReports');
    Route::post('/reports/generate', 'App\Http\Controllers\ReportController@generateUserReport');
    Route::get('/orders', 'App\Http\Controllers\CommerceController@getUserOrders');
    Route::post('/ai/chat', 'App\Http\Controllers\AIController@chatWithAssistant');
    Route::get('/recommendations', 'App\Http\Controllers\UserController@getRecommendations');
});

// 11-Role Protected Admin APIs
Route::middleware(['auth:sanctum', 'can:access-admin'])->prefix('v1/admin')->group(function () {
    // Super Admin & General Admin
    Route::get('/metrics/overview', 'App\Http\Controllers\AdminDashboardController@getSuperMetrics');
    Route::get('/users', 'App\Http\Controllers\AdminDashboardController@getUsersList');

    // Astrology & Numerology Admins
    Route::get('/astrology/systems', 'App\Http\Controllers\AdminDashboardController@getAstrologySystems');
    Route::post('/numerology/nikb-rules', 'App\Http\Controllers\AdminDashboardController@updateNikbRules');

    // AI Admin
    Route::get('/ai/prompts', 'App\Http\Controllers\AdminDashboardController@getAiPrompts');
    Route::put('/ai/prompts/{key}', 'App\Http\Controllers\AdminDashboardController@updateAiPrompt');
    Route::get('/ai/usage-logs', 'App\Http\Controllers\AdminDashboardController@getAiUsageLogs');

    // E-Commerce & Inventory Admin
    Route::get('/ecommerce/products', 'App\Http\Controllers\AdminDashboardController@getAdminProducts');
    Route::post('/ecommerce/products', 'App\Http\Controllers\AdminDashboardController@saveProduct');
    Route::get('/ecommerce/orders', 'App\Http\Controllers\AdminDashboardController@getAdminOrders');

    // Affiliate Admin
    Route::get('/affiliate/merchants', 'App\Http\Controllers\AdminDashboardController@getAffiliateMerchants');
    Route::get('/affiliate/clicks-analytics', 'App\Http\Controllers\AdminDashboardController@getAffiliateAnalytics');

    // Marketing & UTM Admin
    Route::get('/marketing/attribution', 'App\Http\Controllers\AdminDashboardController@getAttributionData');

    // Analytics Admin
    Route::get('/analytics/funnels', 'App\Http\Controllers\AdminDashboardController@getFunnelMetrics');
});
