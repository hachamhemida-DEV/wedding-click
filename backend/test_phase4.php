<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Service;

echo "=== Phase 4 Backend Tests ===" . PHP_EOL . PHP_EOL;

// Test 1: Total services
$total = Service::where('status', 'active')->count();
echo "1. Total active services: {$total}" . PHP_EOL;

// Test 2: Filter by category (halls)
$halls = Service::whereHas('category', fn($q) => $q->where('slug', 'halls'))->count();
echo "2. Filter category=halls: {$halls} (expected 1)" . PHP_EOL;

// Test 3: Filter by wilaya
$alger = Service::where('wilaya', 'Alger')->count();
echo "3. Filter wilaya=Alger: {$alger} (expected 3)" . PHP_EOL;

// Test 4: Filter by price range 50k-100k
$priceRange = Service::where('price', '>=', 50000)->where('price', '<=', 100000)->count();
echo "4. Filter price 50k-100k: {$priceRange} (expected 1)" . PHP_EOL;

// Test 5: Images cast works correctly
$service = Service::first();
echo "5. Images type: " . gettype($service->images) . " (expected array)" . PHP_EOL;
if (is_array($service->images)) {
    echo "   images[0]: " . ($service->images[0] ?? 'null') . PHP_EOL;
}

// Test 6: Single service with relations
$detail = Service::with(['vendor.vendorProfile', 'category'])->first();
echo "6. Service detail - title: {$detail->title}" . PHP_EOL;
echo "   vendor name: {$detail->vendor->name}" . PHP_EOL;
echo "   vendor profile: {$detail->vendor->vendorProfile->business_name}" . PHP_EOL;
echo "   category: {$detail->category->name_fr}" . PHP_EOL;

// Test 7: Non-existent service
$notFound = Service::find(99999);
echo "7. Non-existent service (id=99999): " . ($notFound === null ? 'null (correct)' : 'ERROR - found something') . PHP_EOL;

echo PHP_EOL . "=== All backend tests done ===" . PHP_EOL;
