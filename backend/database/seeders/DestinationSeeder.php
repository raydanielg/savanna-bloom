<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Destination;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            [
                'name' => 'Serengeti National Park',
                'slug' => 'serengeti-national-park',
                'subtitle' => 'The Great Migration',
                'short_description' => 'Witness the greatest wildlife show on Earth - the Great Migration.',
                'description' => 'The Serengeti is one of the most famous wildlife reserves in the world, known for the annual Great Migration of over 1.5 million wildebeest and hundreds of thousands of gazelles and zebras.',
                'image' => '/storage/safaris/serengeti.jpg',
                'region' => 'Northern Tanzania',
                'country' => 'Tanzania',
                'latitude' => -2.3333,
                'longitude' => 34.8333,
                'highlights' => ['Great Migration', 'Big Five', 'Hot Air Balloon Safaris', 'Maasai Culture'],
                'wildlife' => ['Lion', 'Leopard', 'Elephant', 'Buffalo', 'Rhino', 'Wildebeest', 'Zebra', 'Cheetah'],
                'best_time' => 'June to October',
                'tours_count' => 15,
                'featured' => true,
                'active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Ngorongoro Crater',
                'slug' => 'ngorongoro-crater',
                'subtitle' => "World's Largest Intact Caldera",
                'short_description' => 'A natural wonder and home to the densest wildlife population in Africa.',
                'description' => 'The Ngorongoro Crater is a UNESCO World Heritage Site and one of the most stunning natural wonders on Earth. The crater floor is home to over 25,000 large animals.',
                'image' => '/storage/destinations/ngorongoro-crater.jpg',
                'region' => 'Northern Tanzania',
                'country' => 'Tanzania',
                'latitude' => -3.1750,
                'longitude' => 35.5833,
                'highlights' => ['Crater Floor Safari', 'Big Five', 'Flamingos', 'Maasai Villages'],
                'wildlife' => ['Black Rhino', 'Lion', 'Elephant', 'Buffalo', 'Hippo', 'Flamingo', 'Zebra'],
                'best_time' => 'Year Round',
                'tours_count' => 12,
                'featured' => true,
                'active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Tarangire National Park',
                'slug' => 'tarangire-national-park',
                'subtitle' => 'Land of Giants',
                'short_description' => 'Famous for its large elephant herds and iconic baobab trees.',
                'description' => 'Tarangire National Park is known for its large herds of elephants and iconic baobab trees. The Tarangire River is the only source of water in the dry season.',
                'image' => '/storage/destinations/tarangire-elephants.jpg',
                'region' => 'Northern Tanzania',
                'country' => 'Tanzania',
                'latitude' => -4.0000,
                'longitude' => 35.9167,
                'highlights' => ['Elephant Herds', 'Baobab Trees', 'Bird Watching', 'Tree-climbing Lions'],
                'wildlife' => ['Elephant', 'Lion', 'Leopard', 'Cheetah', 'Giraffe', 'Zebra', 'Wildebeest'],
                'best_time' => 'June to October',
                'tours_count' => 8,
                'featured' => true,
                'active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Lake Manyara National Park',
                'slug' => 'lake-manyara-national-park',
                'subtitle' => 'Tree-Climbing Lions',
                'short_description' => 'A scenic park famous for tree-climbing lions and flamingos.',
                'description' => 'Lake Manyara National Park is a scenic gem known for its tree-climbing lions, large flocks of flamingos, and diverse ecosystems.',
                'image' => '/storage/destinations/lake-manyara-flamingos.jpg',
                'region' => 'Northern Tanzania',
                'country' => 'Tanzania',
                'latitude' => -3.6000,
                'longitude' => 35.8500,
                'highlights' => ['Tree-climbing Lions', 'Flamingos', 'Hot Springs', 'Canopy Walk'],
                'wildlife' => ['Lion', 'Elephant', 'Hippo', 'Flamingo', 'Baboon', 'Giraffe'],
                'best_time' => 'June to October',
                'tours_count' => 6,
                'featured' => false,
                'active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Mount Kilimanjaro',
                'slug' => 'mount-kilimanjaro',
                'subtitle' => 'Africa\'s Highest Peak',
                'short_description' => 'Climb the roof of Africa - the highest freestanding mountain in the world.',
                'description' => 'Mount Kilimanjaro is Africa\'s highest mountain and the world\'s tallest freestanding mountain. It offers multiple climbing routes for all skill levels.',
                'image' => '/storage/kilimanjaro/kilimanjaro-climbing.jpg',
                'region' => 'Northern Tanzania',
                'country' => 'Tanzania',
                'latitude' => -3.0674,
                'longitude' => 37.3556,
                'highlights' => ['Uhuru Peak', 'Glaciers', 'Five Climate Zones', 'Sunrise at Summit'],
                'wildlife' => ['Colobus Monkey', 'Blue Monkey', 'Elephant', 'Buffalo', 'Leopard'],
                'best_time' => 'January to March, June to October',
                'tours_count' => 7,
                'featured' => true,
                'active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Zanzibar Island',
                'slug' => 'zanzibar-island',
                'subtitle' => 'Spice Island Paradise',
                'short_description' => 'Pristine beaches, rich history, and the famous Stone Town.',
                'description' => 'Zanzibar is a tropical paradise known for its pristine beaches, rich Swahili culture, and historic Stone Town - a UNESCO World Heritage Site.',
                'image' => '/storage/destinations/zanzibar-paradise.jpg',
                'region' => 'Coastal Tanzania',
                'country' => 'Tanzania',
                'latitude' => -6.1659,
                'longitude' => 39.2026,
                'highlights' => ['Stone Town', 'Spice Tours', 'Beach Relaxation', 'Snorkeling'],
                'wildlife' => ['Dolphins', 'Sea Turtles', 'Tropical Fish', 'Red Colobus Monkey'],
                'best_time' => 'June to October, December to February',
                'tours_count' => 10,
                'featured' => true,
                'active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($destinations as $destination) {
            Destination::updateOrCreate(
                ['slug' => $destination['slug']],
                $destination
            );
        }
    }
}
