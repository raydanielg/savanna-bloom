<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Jennifer Thompson',
                'location' => 'New York',
                'country' => 'United States',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b37330?w=100',
                'rating' => 5.0,
                'text' => 'An absolutely incredible experience! The Serengeti migration safari exceeded all our expectations. Our guide was knowledgeable and the accommodations were perfect.',
                'featured' => true,
                'approved' => true,
            ],
            [
                'name' => 'Thomas Mueller',
                'location' => 'Munich',
                'country' => 'Germany',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                'rating' => 5.0,
                'text' => 'Climbing Kilimanjaro was a life-changing experience. The team was professional, supportive, and made sure we were safe throughout the journey. Highly recommended!',
                'featured' => true,
                'approved' => true,
            ],
            [
                'name' => 'Sophie Martin',
                'location' => 'Paris',
                'country' => 'France',
                'avatar' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d35?w=100',
                'rating' => 4.5,
                'text' => 'The Ngorongoro Crater is breathtaking! We saw all the Big Five in one day. The tour was well organized and our guide was excellent.',
                'featured' => true,
                'approved' => true,
            ],
            [
                'name' => 'Robert Chang',
                'location' => 'Singapore',
                'country' => 'Singapore',
                'avatar' => 'https://images.unsplash.com/photo-1500648647774-24c8b9aca8c7?w=100',
                'rating' => 5.0,
                'text' => 'From the moment we landed to our departure, everything was perfectly arranged. Zanzibar was the perfect ending to our Tanzania adventure.',
                'featured' => false,
                'approved' => true,
            ],
            [
                'name' => 'Anna Kowalski',
                'location' => 'Warsaw',
                'country' => 'Poland',
                'avatar' => 'https://images.unsplash.com/photo-1544005313-94e67e6a7c0a?w=100',
                'rating' => 5.0,
                'text' => 'The hot air balloon ride over the Serengeti was magical! Seeing the sunrise over the savanna with thousands of animals below was unforgettable.',
                'featured' => true,
                'approved' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}
