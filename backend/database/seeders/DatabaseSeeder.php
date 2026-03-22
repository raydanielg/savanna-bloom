<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            DestinationSeeder::class,
            SafariSeeder::class,
            KilimanjaroRouteSeeder::class,
            DayTripSeeder::class,
            PackageSeeder::class,
            GallerySeeder::class,
            FaqSeeder::class,
            BookingSeeder::class,
            InquirySeeder::class,
            TestimonialSeeder::class,
            BlogPostSeeder::class,
        ]);
    }
}
