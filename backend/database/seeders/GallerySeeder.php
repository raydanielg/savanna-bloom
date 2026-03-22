<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $images = [
            ['title' => 'Lion at Serengeti Sunset', 'category' => 'Wildlife', 'location' => 'Serengeti National Park', 'description' => 'A majestic lion silhouetted against the golden African sunset', 'image' => '/storage/gallery/wildlife-lion.jpg'],
            ['title' => 'Elephant Herd Crossing', 'category' => 'Wildlife', 'location' => 'Tarangire National Park', 'description' => 'Large elephant herd crossing the Tarangire River', 'image' => '/storage/gallery/elephant.jpg'],
            ['title' => 'Leopard in Tree', 'category' => 'Wildlife', 'location' => 'Serengeti National Park', 'description' => 'Elusive leopard resting in an acacia tree', 'image' => '/storage/gallery/leopard.jpg'],
            ['title' => 'Mount Kilimanjaro Peak', 'category' => 'Mountains', 'location' => 'Kilimanjaro National Park', 'description' => 'Snow-capped peak of Africa\'s highest mountain', 'image' => '/storage/hero/kili-summit.jpg'],
            ['title' => 'Zanzibar Beach Paradise', 'category' => 'Beach', 'location' => 'Zanzibar', 'description' => 'Pristine white sand beaches of Zanzibar', 'image' => '/storage/gallery/zanzibar-beach.jpg'],
            ['title' => 'Luxury Safari Camp', 'category' => 'Accommodation', 'location' => 'Serengeti National Park', 'description' => 'Luxury tented camp under the African stars', 'image' => '/storage/gallery/luxury-camp.jpg'],
            ['title' => 'Ngorongoro Crater View', 'category' => 'Landscape', 'location' => 'Ngorongoro Conservation Area', 'description' => 'Panoramic view of the Ngorongoro Crater floor', 'image' => '/storage/destinations/ngorongoro-crater.jpg'],
            ['title' => 'Safari Vehicle Adventure', 'category' => 'Adventure', 'location' => 'Serengeti National Park', 'description' => 'Game drive in custom 4x4 safari vehicle', 'image' => '/storage/gallery/safari-vehicle.jpg'],
            ['title' => 'Luxury Lodge Retreat', 'category' => 'Accommodation', 'location' => 'Tanzania', 'description' => 'Premium lodge accommodation in the wilderness', 'image' => '/storage/gallery/luxury-lodge.jpg'],
            ['title' => 'Great Migration', 'category' => 'Wildlife', 'location' => 'Serengeti National Park', 'description' => 'Millions of wildebeest crossing the plains', 'image' => '/storage/hero/migration.jpg'],
            ['title' => 'Kilimanjaro Climbing', 'category' => 'Adventure', 'location' => 'Kilimanjaro National Park', 'description' => 'Climbers ascending to the roof of Africa', 'image' => '/storage/kilimanjaro/kilimanjaro-climbing.jpg'],
            ['title' => 'Serengeti Plains', 'category' => 'Landscape', 'location' => 'Serengeti National Park', 'description' => 'Endless plains of the Serengeti ecosystem', 'image' => '/storage/safaris/serengeti.jpg'],
        ];

        foreach ($images as $index => $image) {
            Gallery::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($image['title'])],
                [
                    'title' => $image['title'],
                    'slug' => \Illuminate\Support\Str::slug($image['title']),
                    'description' => $image['description'],
                    'image' => $image['image'],
                    'category' => $image['category'],
                    'location' => $image['location'],
                    'featured' => $index < 6,
                    'active' => true,
                    'sort_order' => $index,
                ]
            );
        }

        $this->command->info('12 gallery items created successfully!');
    }
}
