<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DayTrip;

class DayTripSeeder extends Seeder
{
    public function run(): void
    {
        $trips = [
            [
                'name' => 'Arusha National Park Day Trip',
                'slug' => 'arusha-national-park-day-trip',
                'short_description' => 'Explore the closest national park to Arusha town.',
                'description' => 'A perfect day trip featuring Mount Meru views, flamingos at Momella Lakes, and walking safaris.',
                'category' => 'Wildlife',
                'price' => 250.00,
                'currency' => 'USD',
                'duration' => 'Full Day (8 hours)',
                'image' => '/storage/safaris/serengeti.jpg',
                'highlights' => ['Mount Meru views', 'Flamingos', 'Walking safari', 'Black-and-white colobus monkeys'],
                'included' => ['Park fees', 'Guide', 'Lunch', 'Transport'],
                'excluded' => ['Tips', 'Personal items'],
                'location' => 'Arusha',
                'min_guests' => 1,
                'max_guests' => 12,
                'featured' => true,
                'active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Materuni Waterfalls & Coffee Tour',
                'slug' => 'materuni-waterfalls-coffee-tour',
                'short_description' => 'Combine nature and culture in one memorable day.',
                'description' => 'Visit the stunning Materuni Waterfalls and experience a traditional Chagga coffee tour.',
                'category' => 'Cultural',
                'price' => 120.00,
                'currency' => 'USD',
                'duration' => 'Full Day (6-7 hours)',
                'image' => '/storage/hero/kilimanjaro-hero.jpg',
                'highlights' => ['90m waterfall', 'Coffee processing', 'Traditional lunch', 'Swimming'],
                'included' => ['Guide', 'Coffee tour', 'Lunch', 'Transport'],
                'excluded' => ['Tips', 'Personal items'],
                'location' => 'Moshi',
                'min_guests' => 2,
                'max_guests' => 20,
                'featured' => true,
                'active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Maasai Cultural Experience',
                'slug' => 'maasai-cultural-experience',
                'short_description' => 'Immerse yourself in authentic Maasai culture.',
                'description' => 'Visit a traditional Maasai village, learn about their customs, and participate in traditional dances.',
                'category' => 'Cultural',
                'price' => 100.00,
                'currency' => 'USD',
                'duration' => 'Half Day (4 hours)',
                'image' => '/storage/gallery/elephant.jpg',
                'highlights' => ['Traditional village visit', 'Dancing ceremony', 'Handicrafts', 'Maasai lunch'],
                'included' => ['Guide', 'Village fees', 'Lunch', 'Transport'],
                'excluded' => ['Tips', 'Personal items'],
                'location' => 'Arusha Region',
                'min_guests' => 2,
                'max_guests' => 15,
                'featured' => false,
                'active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Zanzibar Spice Tour',
                'slug' => 'zanzibar-spice-tour',
                'short_description' => 'Discover the aromatic spices of Zanzibar.',
                'description' => 'Tour spice plantations, taste exotic spices, and learn about Zanzibar\'s spice trade history.',
                'category' => 'Cultural',
                'price' => 80.00,
                'currency' => 'USD',
                'duration' => 'Half Day (4 hours)',
                'image' => '/storage/destinations/zanzibar-paradise.jpg',
                'highlights' => ['Spice tasting', 'Plantation tour', 'Traditional lunch', 'Fresh fruit'],
                'included' => ['Guide', 'Spice tour', 'Lunch', 'Transport'],
                'excluded' => ['Tips', 'Personal items'],
                'location' => 'Zanzibar',
                'min_guests' => 2,
                'max_guests' => 20,
                'featured' => true,
                'active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($trips as $trip) {
            DayTrip::updateOrCreate(
                ['slug' => $trip['slug']],
                $trip
            );
        }
    }
}
