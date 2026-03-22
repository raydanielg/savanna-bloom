<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;
use App\Models\Destination;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get destinations
        $serengeti = Destination::where('name', 'like', '%Serengeti%')->first();
        $ngorongoro = Destination::where('name', 'like', '%Ngorongoro%')->first();
        $tarangire = Destination::where('name', 'like', '%Tarangire%')->first();
        $zanzibar = Destination::where('name', 'like', '%Zanzibar%')->first();
        $manyara = Destination::where('name', 'like', '%Manyara%')->first();

        $packages = [
            [
                'name' => 'Serengeti Great Migration Safari',
                'slug' => 'serengeti-great-migration-safari',
                'subtitle' => 'Witness the Greatest Wildlife Show on Earth',
                'short_description' => 'Experience the awe-inspiring Great Migration where millions of wildebeest, zebras, and gazelles traverse the Serengeti plains in their eternal quest for fresh grazing.',
                'description' => 'This once-in-a-lifetime safari takes you to the heart of the Serengeti during the Great Migration. Watch as over 1.5 million wildebeest, along with hundreds of thousands of zebras and gazelles, make their annual journey across the plains. You\'ll witness dramatic river crossings, predator-prey interactions, and the raw beauty of nature at its finest. Our expert guides know exactly where to find the herds throughout the year, ensuring you get front-row seats to this spectacular natural phenomenon.',
                'image' => '/storage/safaris/serengeti.jpg',
                'category' => 'Wildlife Safari',
                'destination_id' => $serengeti?->id,
                'duration_days' => 7,
                'duration_nights' => 6,
                'price' => 4500.00,
                'discount_price' => 3800.00,
                'difficulty' => 'Moderate',
                'min_guests' => 2,
                'max_guests' => 8,
                'accommodation_type' => 'Luxury Tented Camp',
                'highlights' => [
                    'Witness the Great Migration river crossings',
                    'Big Five game viewing opportunities',
                    'Hot air balloon safari at dawn',
                    'Bush breakfast in the Serengeti plains',
                    'Maasai cultural visit',
                    'Professional photographer guide available',
                ],
                'includes' => [
                    'All park fees and conservation fees',
                    'Full board accommodation',
                    'Professional English-speaking guide',
                    '4x4 safari vehicle with pop-up roof',
                    'Airport transfers',
                    'Bottled water during game drives',
                    'Emergency medical evacuation insurance',
                ],
                'excludes' => [
                    'International flights',
                    'Visa fees',
                    'Personal items and souvenirs',
                    'Tips and gratuities',
                    'Alcoholic beverages',
                    'Hot air balloon ride (optional extra)',
                ],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Arrival in Arusha', 'description' => 'Arrive at Kilimanjaro International Airport. Meet your guide and transfer to your hotel in Arusha. Welcome dinner and safari briefing.'],
                    ['day' => 2, 'title' => 'Tarangire National Park', 'description' => 'Morning drive to Tarangire, known for its large elephant herds and iconic baobab trees. Afternoon game drive.'],
                    ['day' => 3, 'title' => 'Journey to Central Serengeti', 'description' => 'Drive through the Ngorongoro Highlands to the Serengeti. Visit a Maasai village en route. Afternoon game drive in the Serengeti.'],
                    ['day' => 4, 'title' => 'Great Migration Experience', 'description' => 'Full day tracking the Great Migration. Witness thousands of wildebeest and zebras. Picnic lunch in the bush.'],
                    ['day' => 5, 'title' => 'Serengeti Exploration', 'description' => 'Early morning hot air balloon option. Full day game drives exploring different regions of the Serengeti.'],
                    ['day' => 6, 'title' => 'Ngorongoro Crater', 'description' => 'Morning game drive as you exit Serengeti. Descend into the Ngorongoro Crater for incredible wildlife viewing.'],
                    ['day' => 7, 'title' => 'Departure', 'description' => 'Morning at leisure. Transfer to Kilimanjaro International Airport for your departure flight.'],
                ],
                'featured' => true,
                'active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Kilimanjaro Climb - Machame Route',
                'slug' => 'kilimanjaro-climb-machame-route',
                'subtitle' => 'The "Whiskey Route" - Most Scenic Path to the Roof of Africa',
                'short_description' => 'Conquer Africa\'s highest peak via the stunning Machame Route, known for its diverse landscapes and excellent acclimatization profile.',
                'description' => 'The Machame Route, nicknamed the "Whiskey Route" for its more challenging nature compared to Marangu, offers the most scenic and diverse path to Mount Kilimanjaro\'s summit. Over 7 days, you\'ll traverse through five distinct climate zones - from lush rainforest to alpine desert to arctic summit. This route has one of the highest success rates due to its excellent acclimatization profile with "climb high, sleep low" opportunities. Our experienced mountain crew includes certified guides, porters, and a chef who will ensure your safety and comfort throughout the journey.',
                'image' => '/storage/kilimanjaro/kilimanjaro-climbing.jpg',
                'category' => 'Mountain Climbing',
                'destination_id' => null,
                'duration_days' => 7,
                'duration_nights' => 6,
                'price' => 3200.00,
                'discount_price' => null,
                'difficulty' => 'Challenging',
                'min_guests' => 1,
                'max_guests' => 12,
                'accommodation_type' => 'Mountain Tents',
                'highlights' => [
                    'Summit Africa\'s highest peak at 5,895m',
                    'Traverse 5 climate zones',
                    'Stunning views from Shira Plateau',
                    'Lava Tower acclimatization hike',
                    'Sunrise at Uhuru Peak',
                    'Professional mountain crew',
                ],
                'includes' => [
                    'Kilimanjaro park fees and rescue fees',
                    'Professional certified mountain guides',
                    'Porters and cook',
                    'Mountain tents and sleeping mats',
                    'All meals on the mountain',
                    'Oxygen cylinder and first aid kit',
                    'Airport transfers',
                    'Pre-climb hotel accommodation',
                ],
                'excludes' => [
                    'International flights',
                    'Personal climbing gear',
                    'Tips for mountain crew',
                    'Travel insurance',
                    'Personal items and medications',
                ],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Machame Gate to Machame Camp', 'description' => 'Start at Machame Gate (1,490m). Hike through lush rainforest to Machame Camp (2,980m). 5-7 hours hiking.'],
                    ['day' => 2, 'title' => 'Machame Camp to Shira Camp', 'description' => 'Trek through moorland to Shira Plateau. Reach Shira Camp (3,840m). 4-6 hours hiking.'],
                    ['day' => 3, 'title' => 'Shira Camp to Barranco Camp', 'description' => 'Climb to Lava Tower (4,630m) for acclimatization, then descend to Barranco Camp (3,950m). 6-8 hours.'],
                    ['day' => 4, 'title' => 'Barranco Camp to Karanga Camp', 'description' => 'Scramble the Barranco Wall, then traverse to Karanga Camp (3,995m). 4-5 hours hiking.'],
                    ['day' => 5, 'title' => 'Karanga Camp to Barafu Camp', 'description' => 'Trek through alpine desert to Barafu Base Camp (4,640m). Rest and prepare for summit night. 4-5 hours.'],
                    ['day' => 6, 'title' => 'Summit Day to Mweka Camp', 'description' => 'Midnight start for summit attempt. Reach Uhuru Peak (5,895m) at sunrise. Descend to Mweka Camp (3,100m). 12-16 hours.'],
                    ['day' => 7, 'title' => 'Mweka Camp to Mweka Gate', 'description' => 'Final descent through rainforest to Mweka Gate. Receive summit certificate. Transfer to hotel. 3-4 hours.'],
                ],
                'featured' => true,
                'active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Zanzibar Beach & Spice Tour',
                'slug' => 'zanzibar-beach-spice-tour',
                'subtitle' => 'Relax on Pristine Beaches and Discover the Spice Island',
                'short_description' => 'Combine relaxation on Zanzibar\'s world-famous beaches with a fascinating spice tour and Stone Town exploration.',
                'description' => 'Escape to the exotic Zanzibar Archipelago, where turquoise waters meet pristine white-sand beaches. This package combines pure relaxation with cultural discovery. Explore the UNESCO World Heritage Stone Town with its winding alleys and historic architecture. Take a sensory journey on a spice tour to discover why Zanzibar is called the "Spice Island." Spend your days swimming, snorkeling, diving, or simply lounging on some of Africa\'s most beautiful beaches. The perfect end to a mainland safari or a standalone tropical getaway.',
                'image' => '/storage/destinations/zanzibar-paradise.jpg',
                'category' => 'Beach Holiday',
                'destination_id' => $zanzibar?->id,
                'duration_days' => 5,
                'duration_nights' => 4,
                'price' => 1800.00,
                'discount_price' => 1500.00,
                'difficulty' => 'Easy',
                'min_guests' => 1,
                'max_guests' => 10,
                'accommodation_type' => 'Beach Resort',
                'highlights' => [
                    'Pristine white-sand beaches',
                    'Stone Town UNESCO World Heritage Site',
                    'Spice plantation tour',
                    'Snorkeling at Mnemba Atoll',
                    'Sunset dhow cruise',
                    'Dolphin watching excursion',
                ],
                'includes' => [
                    '4 nights beachfront accommodation',
                    'Daily breakfast and dinner',
                    'Stone Town guided tour',
                    'Spice tour with local guide',
                    'Snorkeling equipment',
                    'Airport transfers',
                    'Welcome drink on arrival',
                ],
                'excludes' => [
                    'International flights',
                    'Lunches and beverages',
                    'Water sports activities',
                    'Tips and personal items',
                    'Travel insurance',
                ],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Arrival in Zanzibar', 'description' => 'Arrive at Zanzibar Airport. Transfer to your beach resort. Relax and enjoy the beach. Welcome dinner.'],
                    ['day' => 2, 'title' => 'Stone Town Exploration', 'description' => 'Morning guided tour of Stone Town. Visit historic sites, local markets, and the slave market memorial. Afternoon at leisure.'],
                    ['day' => 3, 'title' => 'Spice Tour & Snorkeling', 'description' => 'Morning spice plantation tour. Taste and learn about exotic spices. Afternoon snorkeling at Mnemba Atoll.'],
                    ['day' => 4, 'title' => 'Beach Day & Dolphin Watching', 'description' => 'Morning dolphin watching boat trip. Full day to enjoy beach activities, water sports, or pure relaxation.'],
                    ['day' => 5, 'title' => 'Departure', 'description' => 'Morning at leisure. Transfer to Zanzibar Airport for your departure flight.'],
                ],
                'featured' => true,
                'active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Northern Circuit Safari',
                'slug' => 'northern-circuit-safari',
                'subtitle' => 'The Ultimate Tanzania Wildlife Experience',
                'short_description' => 'Experience the best of Tanzania\'s Northern Safari Circuit - Serengeti, Ngorongoro, Tarangire, and Lake Manyara in one epic journey.',
                'description' => 'This comprehensive safari covers all the highlights of Tanzania\'s legendary Northern Circuit. From the elephant herds of Tarangire to the tree-climbing lions of Lake Manyara, from the endless plains of the Serengeti to the wildlife-rich floor of the Ngorongoro Crater - this safari delivers it all. You\'ll stay in carefully selected lodges and tented camps that offer both comfort and authentic safari atmosphere. Our expert guides will share their deep knowledge of the ecosystem, ensuring you don\'t miss any of the incredible wildlife encounters this region has to offer.',
                'image' => '/storage/destinations/ngorongoro-crater.jpg',
                'category' => 'Multi-Park Safari',
                'destination_id' => $serengeti?->id,
                'duration_days' => 10,
                'duration_nights' => 9,
                'price' => 6500.00,
                'discount_price' => 5500.00,
                'difficulty' => 'Moderate',
                'min_guests' => 2,
                'max_guests' => 6,
                'accommodation_type' => 'Lodges & Tented Camps',
                'highlights' => [
                    'Four national parks in one safari',
                    'Big Five and more',
                    'Ngorongoro Crater descent',
                    'Serengeti game drives',
                    'Tarangire elephant herds',
                    'Lake Manyara tree-climbing lions',
                    'Maasai cultural experience',
                ],
                'includes' => [
                    'All park and crater fees',
                    '9 nights accommodation',
                    'All meals on safari',
                    'Professional safari guide',
                    '4x4 safari vehicle with pop-up roof',
                    'Bottled water and soft drinks',
                    'Airport transfers',
                    'Emergency medical evacuation',
                ],
                'excludes' => [
                    'International flights',
                    'Visa fees',
                    'Tips and gratuities',
                    'Alcoholic beverages',
                    'Personal items',
                    'Optional activities',
                ],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Arrival in Arusha', 'description' => 'Arrive at Kilimanjaro Airport. Transfer to your lodge in Arusha. Safari briefing and welcome dinner.'],
                    ['day' => 2, 'title' => 'Tarangire National Park', 'description' => 'Drive to Tarangire. Full day game drive viewing large elephant herds and baobab landscapes.'],
                    ['day' => 3, 'title' => 'Lake Manyara', 'description' => 'Morning game drive in Lake Manyara, famous for tree-climbing lions and flamingos. Continue to Karatu.'],
                    ['day' => 4, 'title' => 'Ngorongoro Crater', 'description' => 'Early descent into the crater. Full day wildlife viewing in this natural amphitheater.'],
                    ['day' => 5, 'title' => 'Journey to Serengeti', 'description' => 'Drive to Serengeti via Olduvai Gorge archaeological site. Afternoon game drive.'],
                    ['day' => 6, 'title' => 'Central Serengeti', 'description' => 'Full day exploring Central Serengeti. Excellent big cat sightings.'],
                    ['day' => 7, 'title' => 'Northern Serengeti', 'description' => 'Drive north following the migration (seasonal). River crossing viewing opportunities.'],
                    ['day' => 8, 'title' => 'Serengeti to Karatu', 'description' => 'Morning game drive as you exit Serengeti. Overnight near Ngorongoro.'],
                    ['day' => 9, 'title' => 'Maasai Village & Arusha', 'description' => 'Visit a Maasai village for cultural experience. Return to Arusha. Farewell dinner.'],
                    ['day' => 10, 'title' => 'Departure', 'description' => 'Morning at leisure. Transfer to Kilimanjaro Airport for departure.'],
                ],
                'featured' => true,
                'active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($packages as $packageData) {
            Package::updateOrCreate(
                ['slug' => $packageData['slug']],
                $packageData
            );
        }

        $this->command->info('4 packages created successfully!');
    }
}
