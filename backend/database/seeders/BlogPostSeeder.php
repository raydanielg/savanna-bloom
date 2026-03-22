<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogPost;
use App\Models\User;
use Carbon\Carbon;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@savannabloom.com')->first();
        
        $posts = [
            [
                'title' => 'The Great Migration: Nature\'s Greatest Show',
                'slug' => 'the-great-migration-natures-greatest-show',
                'excerpt' => 'Discover the incredible journey of millions of wildebeest across the Serengeti plains.',
                'content' => 'The Great Migration is one of the most spectacular wildlife events on Earth. Each year, over 1.5 million wildebeest, along with hundreds of thousands of zebras and gazelles, make their circular journey through the Serengeti ecosystem.\n\nThe migration is driven by the search for fresh grass and water. The herds move in a clockwise direction, covering about 500 miles each year.\n\nThe best time to witness the migration depends on what you want to see. The dramatic river crossings typically occur between July and October.',
                'featured_image' => 'https://images.unsplash.com/photo-1516426121-0c23c7a44fca?w=800',
                'category' => 'Wildlife',
                'tags' => ['Migration', 'Serengeti', 'Wildlife', 'Safari'],
                'featured' => true,
                'published' => true,
                'published_at' => Carbon::now()->subDays(10),
                'author_id' => $admin->id ?? 1,
            ],
            [
                'title' => 'How to Prepare for Your Kilimanjaro Climb',
                'slug' => 'how-to-prepare-for-your-kilimanjaro-climb',
                'excerpt' => 'Essential tips for a successful climb to Africa\'s highest peak.',
                'content' => 'Climbing Mount Kilimanjaro is an achievable goal for many people, but proper preparation is essential. Here are our top tips for a successful summit.\n\n1. Choose the right route - longer routes offer better acclimatization.\n2. Train physically - focus on cardio and hiking with a backpack.\n3. Pack wisely - layers are key for varying temperatures.\n4. Stay hydrated - drink at least 3-4 liters of water daily.\n5. Walk slowly - "pole pole" is the key to success.',
                'featured_image' => 'https://images.unsplash.com/photo-1609198092493-6c2612c8137f?w=800',
                'category' => 'Adventure',
                'tags' => ['Kilimanjaro', 'Climbing', 'Adventure', 'Tips'],
                'featured' => true,
                'published' => true,
                'published_at' => Carbon::now()->subDays(20),
                'author_id' => $admin->id ?? 1,
            ],
            [
                'title' => 'The Big Five: Tanzania\'s Iconic Wildlife',
                'slug' => 'the-big-five-tanzanias-iconic-wildlife',
                'excerpt' => 'Learn about the legendary Big Five and where to find them in Tanzania.',
                'content' => 'The Big Five - lion, leopard, elephant, buffalo, and rhino - are the most sought-after animals on safari. Originally named by big-game hunters, today they are the most photographed animals in Africa.\n\n**Lion** - Found throughout the Serengeti and Ngorongoro.\n**Leopard** - Best spotted in Serengeti\'s riverine forests.\n**Elephant** - Abundant in Tarangire and Serengeti.\n**Buffalo** - Common in most parks.\n**Rhino** - Rare, best chance in Ngorongoro Crater.',
                'featured_image' => 'https://images.unsplash.com/photo-1547471080-55cc91292acb?w=800',
                'category' => 'Wildlife',
                'tags' => ['Big Five', 'Wildlife', 'Safari', 'Animals'],
                'featured' => false,
                'published' => true,
                'published_at' => Carbon::now()->subDays(30),
                'author_id' => $admin->id ?? 1,
            ],
        ];

        foreach ($posts as $post) {
            BlogPost::updateOrCreate(
                ['slug' => $post['slug']],
                $post
            );
        }
    }
}
