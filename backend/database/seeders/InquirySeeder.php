<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inquiry;

class InquirySeeder extends Seeder
{
    public function run(): void
    {
        $inquiries = [
            [
                'name' => 'David Brown',
                'email' => 'david.brown@email.com',
                'phone' => '+1-555-987-6543',
                'country' => 'Canada',
                'subject' => 'Safari Inquiry',
                'inquiry_type' => 'safari',
                'message' => 'I am interested in a 7-day safari for a family of 4. We would like to visit Serengeti, Ngorongoro, and Tarangire. What would be the best time to visit?',
                'preferred_date' => '2026-07-15',
                'guests' => 4,
                'status' => 'new',
            ],
            [
                'name' => 'Lisa Anderson',
                'email' => 'lisa.a@email.com',
                'phone' => '+49-30-12345678',
                'country' => 'Germany',
                'subject' => 'Kilimanjaro Climb',
                'inquiry_type' => 'kilimanjaro',
                'message' => 'I want to climb Kilimanjaro via the Machame route in August. I am an experienced hiker. What gear do I need to bring?',
                'preferred_date' => '2026-08-01',
                'guests' => 2,
                'status' => 'read',
            ],
            [
                'name' => 'James Wilson',
                'email' => 'j.wilson@email.com',
                'phone' => '+27-11-555-1234',
                'country' => 'South Africa',
                'subject' => 'Zanzibar Beach Holiday',
                'inquiry_type' => 'beach',
                'message' => 'We are looking for a relaxing beach holiday in Zanzibar after our safari. Can you recommend some good beach resorts?',
                'preferred_date' => '2026-06-20',
                'guests' => 2,
                'status' => 'replied',
            ],
            [
                'name' => 'Maria Garcia',
                'email' => 'maria.g@email.com',
                'phone' => '+34-91-123-4567',
                'country' => 'Spain',
                'subject' => 'Custom Safari Package',
                'inquiry_type' => 'custom',
                'message' => 'We are a group of 8 friends looking for a custom safari experience combining wildlife and cultural activities. Budget is around $4000 per person.',
                'preferred_date' => '2026-09-10',
                'guests' => 8,
                'status' => 'new',
            ],
        ];

        foreach ($inquiries as $inquiry) {
            Inquiry::create($inquiry);
        }
    }
}
