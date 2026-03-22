<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Safari;

class SafariSeeder extends Seeder
{
    public function run(): void
    {
        $safaris = [
            [
                'name' => 'Serengeti Great Migration Safari',
                'slug' => 'serengeti-great-migration-safari',
                'short_description' => 'Witness the greatest wildlife spectacle on Earth.',
                'description' => 'Experience the awe-inspiring Great Migration as millions of wildebeest, zebras, and gazelles traverse the Serengeti plains in search of fresh grass.',
                'category' => 'Wildlife Safari',
                'duration' => '5 Days / 4 Nights',
                'days' => 5,
                'price' => 2500.00,
                'currency' => 'USD',
                'image' => '/storage/safaris/serengeti.jpg',
                'highlights' => ['Great Migration', 'Big Five', 'Hot Air Balloon', 'Maasai Village Visit'],
                'included' => ['Park fees', 'Professional guide', '4x4 Safari vehicle', 'Full board accommodation', 'Airport transfers'],
                'excluded' => ['International flights', 'Visa fees', 'Personal items', 'Tips'],
                'difficulty' => 'Easy',
                'min_guests' => 2,
                'max_guests' => 8,
                'destination_id' => 1,
                'featured' => true,
                'active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Northern Circuit Safari',
                'slug' => 'northern-circuit-safari',
                'short_description' => 'Explore the best of Tanzania\'s northern parks.',
                'description' => 'Visit Tarangire, Lake Manyara, Ngorongoro Crater, and Serengeti in one epic journey through Tanzania\'s most iconic landscapes.',
                'category' => 'Wildlife Safari',
                'duration' => '7 Days / 6 Nights',
                'days' => 7,
                'price' => 3200.00,
                'currency' => 'USD',
                'image' => '/storage/safaris/ngorongoro.jpg',
                'highlights' => ['Four National Parks', 'Ngorongoro Crater', 'Tree-climbing Lions', 'Big Five'],
                'included' => ['Park fees', 'Professional guide', '4x4 Safari vehicle', 'Full board accommodation', 'Airport transfers'],
                'excluded' => ['International flights', 'Visa fees', 'Personal items', 'Tips'],
                'difficulty' => 'Easy',
                'min_guests' => 2,
                'max_guests' => 8,
                'destination_id' => 2,
                'featured' => true,
                'active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Tarangire & Ngorongoro Safari',
                'slug' => 'tarangire-ngorongoro-safari',
                'short_description' => 'Perfect weekend getaway to two iconic parks.',
                'description' => 'A short but rewarding safari combining the elephant paradise of Tarangire with the wildlife-rich Ngorongoro Crater.',
                'category' => 'Wildlife Safari',
                'duration' => '3 Days / 2 Nights',
                'days' => 3,
                'price' => 1200.00,
                'currency' => 'USD',
                'image' => '/storage/safaris/tarangire.jpg',
                'highlights' => ['Elephant Herds', 'Baobab Trees', 'Ngorongoro Crater', 'Big Five'],
                'included' => ['Park fees', 'Professional guide', '4x4 Safari vehicle', 'Full board accommodation', 'Airport transfers'],
                'excluded' => ['International flights', 'Visa fees', 'Personal items', 'Tips'],
                'difficulty' => 'Easy',
                'min_guests' => 2,
                'max_guests' => 8,
                'destination_id' => 3,
                'featured' => false,
                'active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Lake Manyara & Zanzibar Escape',
                'slug' => 'lake-manyara-zanzibar-escape',
                'short_description' => 'Safari and beach combination for the perfect getaway.',
                'description' => 'Combine a safari in Lake Manyara with a relaxing beach holiday in Zanzibar. The best of both worlds.',
                'category' => 'Safari & Beach',
                'duration' => '6 Days / 5 Nights',
                'days' => 6,
                'price' => 2800.00,
                'currency' => 'USD',
                'image' => '/storage/safaris/zanzibar.jpg',
                'highlights' => ['Tree-climbing Lions', 'Flamingos', 'Zanzibar Beaches', 'Stone Town'],
                'included' => ['Park fees', 'Professional guide', '4x4 Safari vehicle', 'Beach hotel', 'All meals'],
                'excluded' => ['International flights', 'Visa fees', 'Personal items', 'Tips'],
                'difficulty' => 'Easy',
                'min_guests' => 2,
                'max_guests' => 8,
                'destination_id' => 4,
                'featured' => true,
                'active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Lake Manyara Adventure',
                'slug' => 'lake-manyara-adventure',
                'short_description' => 'Discover the scenic beauty of Lake Manyara.',
                'description' => 'A short safari exploring the diverse ecosystems of Lake Manyara National Park, famous for its tree-climbing lions.',
                'category' => 'Wildlife Safari',
                'duration' => '2 Days / 1 Night',
                'days' => 2,
                'price' => 800.00,
                'currency' => 'USD',
                'image' => '/storage/safaris/lake-manyara.jpg',
                'highlights' => ['Tree-climbing Lions', 'Flamingos', 'Hot Springs', 'Canopy Walk'],
                'included' => ['Park fees', 'Professional guide', '4x4 Safari vehicle', 'Accommodation', 'Meals'],
                'excluded' => ['International flights', 'Visa fees', 'Personal items', 'Tips'],
                'difficulty' => 'Easy',
                'min_guests' => 2,
                'max_guests' => 8,
                'destination_id' => 4,
                'featured' => false,
                'active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($safaris as $safari) {
            Safari::updateOrCreate(
                ['slug' => $safari['slug']],
                $safari
            );
        }
    }
}
