<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KilimanjaroRoute;

class KilimanjaroRouteSeeder extends Seeder
{
    public function run(): void
    {
        $routes = [
            [
                'name' => 'Machame Route',
                'slug' => 'machame-route',
                'short_description' => 'The most popular and scenic route to Uhuru Peak.',
                'description' => 'Known as the "Whiskey Route", Machame is the most popular path up Kilimanjaro. It offers stunning views and excellent acclimatization.',
                'days' => 7,
                'difficulty' => 'Moderate',
                'price' => 2800.00,
                'currency' => 'USD',
                'image' => '/storage/kilimanjaro/kilimanjaro-climbing.jpg',
                'highlights' => ['Shira Plateau', 'Barranco Wall', 'Lava Tower', 'Stella Point'],
                'included' => ['Park fees', 'Mountain crew', 'Tents & equipment', 'All meals', 'Emergency oxygen'],
                'excluded' => ['Tips', 'Personal gear', 'Travel insurance'],
                'success_rate' => 85.00,
                'min_age' => 10,
                'featured' => true,
                'active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Marangu Route',
                'slug' => 'marangu-route',
                'short_description' => 'The "Coca-Cola" route with hut accommodation.',
                'description' => 'The oldest and most established route. The only route with hut accommodation, making it popular for budget climbers.',
                'days' => 5,
                'difficulty' => 'Moderate',
                'price' => 2200.00,
                'currency' => 'USD',
                'image' => '/storage/kilimanjaro/serengeti-sunset.jpg',
                'highlights' => ['Mandara Huts', 'Horombo Huts', 'Kibo Huts', 'Gilman\'s Point'],
                'included' => ['Park fees', 'Mountain crew', 'Hut accommodation', 'All meals', 'Emergency oxygen'],
                'excluded' => ['Tips', 'Personal gear', 'Travel insurance'],
                'success_rate' => 60.00,
                'min_age' => 10,
                'featured' => false,
                'active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Lemosho Route',
                'slug' => 'lemosho-route',
                'short_description' => 'The most scenic and successful route.',
                'description' => 'A newer route with excellent acclimatization and stunning scenery. Has one of the highest success rates.',
                'days' => 8,
                'difficulty' => 'Moderate',
                'price' => 3500.00,
                'currency' => 'USD',
                'image' => '/storage/hero/kilimanjaro-hero.jpg',
                'highlights' => ['Lemosho Glades', 'Shira Cathedral', 'Northern Circuit', 'Uhuru Peak'],
                'included' => ['Park fees', 'Mountain crew', 'Tents & equipment', 'All meals', 'Emergency oxygen'],
                'excluded' => ['Tips', 'Personal gear', 'Travel insurance'],
                'success_rate' => 95.00,
                'min_age' => 10,
                'featured' => true,
                'active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Rongai Route',
                'slug' => 'rongai-route',
                'short_description' => 'Remote wilderness approach from the north.',
                'description' => 'The only route approaching from the north. Less crowded and offers a true wilderness experience.',
                'days' => 6,
                'difficulty' => 'Moderate',
                'price' => 2600.00,
                'currency' => 'USD',
                'image' => '/storage/hero/kili-summit.jpg',
                'highlights' => ['Remote wilderness', 'Mawenzi Tarn', 'Kibo Huts', 'Gilman\'s Point'],
                'included' => ['Park fees', 'Mountain crew', 'Tents & equipment', 'All meals', 'Emergency oxygen'],
                'excluded' => ['Tips', 'Personal gear', 'Travel insurance'],
                'success_rate' => 80.00,
                'min_age' => 10,
                'featured' => false,
                'active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($routes as $route) {
            KilimanjaroRoute::updateOrCreate(
                ['slug' => $route['slug']],
                $route
            );
        }
    }
}
