<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Safari;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $safari = Safari::first();
        
        $bookings = [
            [
                'booking_reference' => 'SB-' . strtoupper(uniqid()),
                'customer_name' => 'John Smith',
                'customer_email' => 'john.smith@email.com',
                'customer_phone' => '+1-555-123-4567',
                'customer_country' => 'United States',
                'start_date' => Carbon::now()->addDays(30)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(35)->format('Y-m-d'),
                'adults' => 2,
                'children' => 0,
                'total_guests' => 2,
                'total_amount' => 5000.00,
                'paid_amount' => 2500.00,
                'currency' => 'USD',
                'payment_status' => 'partial',
                'status' => 'confirmed',
                'bookable_type' => 'App\\Models\\Safari',
                'bookable_id' => $safari->id ?? 1,
            ],
            [
                'booking_reference' => 'SB-' . strtoupper(uniqid()),
                'customer_name' => 'Emma Johnson',
                'customer_email' => 'emma.j@email.com',
                'customer_phone' => '+44-20-7946-0958',
                'customer_country' => 'United Kingdom',
                'start_date' => Carbon::now()->addDays(45)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(52)->format('Y-m-d'),
                'adults' => 4,
                'children' => 2,
                'total_guests' => 6,
                'total_amount' => 19200.00,
                'paid_amount' => 0,
                'currency' => 'USD',
                'payment_status' => 'unpaid',
                'status' => 'pending',
                'bookable_type' => 'App\\Models\\Safari',
                'bookable_id' => $safari->id ?? 1,
            ],
            [
                'booking_reference' => 'SB-' . strtoupper(uniqid()),
                'customer_name' => 'Michael Chen',
                'customer_email' => 'mchen@email.com',
                'customer_phone' => '+86-138-0013-8000',
                'customer_country' => 'China',
                'start_date' => Carbon::now()->addDays(60)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(65)->format('Y-m-d'),
                'adults' => 2,
                'children' => 0,
                'total_guests' => 2,
                'total_amount' => 5000.00,
                'paid_amount' => 5000.00,
                'currency' => 'USD',
                'payment_status' => 'paid',
                'status' => 'confirmed',
                'bookable_type' => 'App\\Models\\Safari',
                'bookable_id' => $safari->id ?? 1,
            ],
            [
                'booking_reference' => 'SB-' . strtoupper(uniqid()),
                'customer_name' => 'Sarah Williams',
                'customer_email' => 'sarah.w@email.com',
                'customer_phone' => '+61-2-9374-4000',
                'customer_country' => 'Australia',
                'start_date' => Carbon::now()->subDays(10)->format('Y-m-d'),
                'end_date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'adults' => 3,
                'children' => 0,
                'total_guests' => 3,
                'total_amount' => 7500.00,
                'paid_amount' => 7500.00,
                'currency' => 'USD',
                'payment_status' => 'paid',
                'status' => 'completed',
                'bookable_type' => 'App\\Models\\Safari',
                'bookable_id' => $safari->id ?? 1,
            ],
        ];

        foreach ($bookings as $booking) {
            Booking::create($booking);
        }
    }
}
