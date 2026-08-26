<?php
require_once __DIR__ . '/config.php';

$input = json_decode(file_get_contents('php://input'), true);

$fullName = trim($input['full_name'] ?? 'Visitor');
$dobStr = $input['dob'] ?? date('Y-m-d');
$birthTime = $input['birth_time'] ?? '12:00';

$dob = new DateTime($dobStr);
$day = (int)$dob->format('d');
$month = (int)$dob->format('m');
$year = (int)$dob->format('Y');

// Helper to reduce number to 1-9
function reduceToSingle($num, $keepMaster = false) {
    while ($num > 9) {
        if ($keepMaster && in_array($num, [11, 22, 33])) {
            return $num;
        }
        $digits = str_split((string)$num);
        $num = array_sum($digits);
    }
    return $num;
}

// 1. Mulank (Psychic Number)
$mulank = reduceToSingle($day);
$compoundNumber = $day;

// 2. Bhagyank (Life Path)
$allDigits = str_split($dob->format('dmY'));
$bhagyank = reduceToSingle(array_sum($allDigits));

// 3. Name Number (Chaldean)
$chaldeanMap = [
    'A'=>1,'I'=>1,'J'=>1,'Q'=>1,'Y'=>1,
    'B'=>2,'K'=>2,'R'=>2,
    'C'=>3,'G'=>3,'L'=>3,'S'=>3,
    'D'=>4,'M'=>4,'T'=>4,
    'E'=>5,'H'=>5,'N'=>5,'X'=>5,
    'U'=>6,'V'=>6,'W'=>6,
    'O'=>7,'Z'=>7,
    'F'=>8,'P'=>8
];
$nameSum = 0;
$cleanName = strtoupper(preg_replace('/[^A-Z]/', '', $fullName));
for ($i = 0; $i < strlen($cleanName); $i++) {
    $char = $cleanName[$i];
    if (isset($chaldeanMap[$char])) {
        $nameSum += $chaldeanMap[$char];
    }
}
$nameNumber = reduceToSingle($nameSum);

// 4. Loshu Grid (3x3)
$dobDigitsStr = $dob->format('dmY');
$loshuGrid = [];
$missingNumbers = [];
$presentNumbers = [];
for ($i = 1; $i <= 9; $i++) {
    $count = substr_count($dobDigitsStr, (string)$i);
    $loshuGrid[(string)$i] = $count;
    if ($count > 0) {
        $presentNumbers[] = $i;
    } else {
        $missingNumbers[] = $i;
    }
}

// 5. Personal Year
$currYear = (int)date('Y');
$personalYear = reduceToSingle($mulank + reduceToSingle($month) + reduceToSingle($currYear));

// 6. Ruling Planets & Lucky Elements
$planetInfo = [
    1 => ['planet' => 'Sun (Surya)', 'colors' => ['Gold', 'Orange', 'Yellow'], 'days' => ['Sunday'], 'gemstone' => 'Ruby (Manikya)'],
    2 => ['planet' => 'Moon (Chandra)', 'colors' => ['Pearl White', 'Silver'], 'days' => ['Monday'], 'gemstone' => 'Pearl (Moti)'],
    3 => ['planet' => 'Jupiter (Guru)', 'colors' => ['Yellow', 'Saffron', 'Gold'], 'days' => ['Thursday'], 'gemstone' => 'Yellow Sapphire (Pukhraj)'],
    4 => ['planet' => 'Rahu (North Node)', 'colors' => ['Electric Blue', 'Grey'], 'days' => ['Saturday'], 'gemstone' => 'Hessonite Garnet (Gomed)'],
    5 => ['planet' => 'Mercury (Budh)', 'colors' => ['Emerald Green', 'Turquoise'], 'days' => ['Wednesday'], 'gemstone' => 'Emerald (Panna)'],
    6 => ['planet' => 'Venus (Shukra)', 'colors' => ['Royal White', 'Pink'], 'days' => ['Friday'], 'gemstone' => 'Diamond / White Opal'],
    7 => ['planet' => 'Ketu (South Node)', 'colors' => ['Light Green', 'Smoky Quartz'], 'days' => ['Thursday'], 'gemstone' => "Cat's Eye (Lehsunia)"],
    8 => ['planet' => 'Saturn (Shani)', 'colors' => ['Matte Black', 'Dark Navy'], 'days' => ['Saturday'], 'gemstone' => 'Blue Sapphire (Neelam)'],
    9 => ['planet' => 'Mars (Mangal)', 'colors' => ['Crimson Red', 'Coral'], 'days' => ['Tuesday'], 'gemstone' => 'Red Coral (Moonga)'],
];

$ruling = $planetInfo[$mulank] ?? $planetInfo[1];

// 7. Recommendations
$recommendations = [
    [
        'item_type' => 'tshirt',
        'title' => "The Sovereign Pioneer — Mulank {$mulank} Luxury T-Shirt",
        'slug' => "mulank-{$mulank}-luxury-tshirt",
        'price' => 999.00,
        'reason' => "Crafted with 24K gold foil geometric symbols to align with your Mulank {$mulank} planetary frequency.",
        'image' => "/images/tshirts/mulank_{$mulank}_front.webp"
    ],
    [
        'item_type' => 'gemstone',
        'title' => "Natural Certified " . $ruling['gemstone'],
        'slug' => "gemstone-remedy-{$mulank}",
        'price' => 4999.00,
        'reason' => "Vibrationally harmonizes {$ruling['planet']} to remove career obstacles.",
        'image' => "/images/remedies/gemstone_sample.webp"
    ]
];

echo json_encode([
    'success' => true,
    'full_name' => $fullName,
    'dob' => $dobStr,
    'mulank' => $mulank,
    'bhagyank' => $bhagyank,
    'name_number' => $nameNumber,
    'compound_number' => $compoundNumber,
    'personal_year' => $personalYear,
    'ruling_planet' => $ruling['planet'],
    'lucky_colors' => $ruling['colors'],
    'lucky_days' => $ruling['days'],
    'lucky_gemstone' => $ruling['gemstone'],
    'loshu_grid' => $loshuGrid,
    'present_numbers' => $presentNumbers,
    'missing_numbers' => $missingNumbers,
    'recommendations' => $recommendations,
    'timestamp' => date('c')
], JSON_PRETTY_PRINT);
