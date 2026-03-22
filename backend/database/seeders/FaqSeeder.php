<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Faq;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            ['question' => 'What is the best time to visit Tanzania for a safari?', 'answer' => 'The best time for a safari in Tanzania is during the dry seasons from June to October and January to February. These periods offer excellent wildlife viewing as animals gather around water sources. The Great Migration in the Serengeti is best viewed from June to July (river crossings) and January to February (calving season).', 'category' => 'Safari', 'featured' => true],
            ['question' => 'Do I need a visa to visit Tanzania?', 'answer' => 'Most visitors require a visa to enter Tanzania. You can obtain a visa on arrival at major airports or apply online through the official e-visa portal. The visa fee is typically $50-100 USD depending on your nationality. We recommend checking with your local Tanzanian embassy for the most current requirements.', 'category' => 'Travel', 'featured' => true],
            ['question' => 'What vaccines are required for Tanzania?', 'answer' => 'Yellow fever vaccination is required if you\'re traveling from or through a yellow fever endemic country. Other recommended vaccines include hepatitis A, typhoid, and routine vaccinations. Malaria prophylaxis is strongly recommended. Consult your doctor 4-6 weeks before travel.', 'category' => 'Health', 'featured' => true],
            ['question' => 'How difficult is climbing Mount Kilimanjaro?', 'answer' => 'Kilimanjaro is a non-technical climb, meaning no mountaineering skills are required. However, it\'s physically demanding due to altitude. Success rates vary by route: Marangu (50%), Machame (85%), and Lemosho (90%). Proper acclimatization and fitness are key. We recommend training 2-3 months before your climb.', 'category' => 'Kilimanjaro', 'featured' => true],
            ['question' => 'What should I pack for a safari?', 'answer' => 'Pack lightweight, neutral-colored clothing (khaki, green, brown), comfortable walking shoes, a wide-brimmed hat, sunglasses, sunscreen, binoculars, camera, and insect repellent. Evenings can be cool, so bring a light jacket. Most lodges provide laundry services.', 'category' => 'Safari', 'featured' => false],
            ['question' => 'Is Tanzania safe for tourists?', 'answer' => 'Tanzania is generally safe for tourists, especially in national parks and tourist areas. Petty crime can occur in cities, so take normal precautions. Our guides are trained in safety protocols, and all our vehicles are equipped with radio communication. Travel insurance is recommended.', 'category' => 'Travel', 'featured' => false],
            ['question' => 'What is the currency in Tanzania?', 'answer' => 'The Tanzanian Shilling (TZS) is the local currency. US dollars are widely accepted in tourist areas. Credit cards are accepted at most lodges and hotels. We recommend carrying some cash for tips, souvenirs, and smaller establishments.', 'category' => 'Travel', 'featured' => false],
            ['question' => 'Can children go on safari?', 'answer' => 'Yes! Tanzania is family-friendly. Many lodges have family rooms and offer child-friendly activities. We recommend safaris for children 6 years and older. Some activities like walking safaris have age restrictions (usually 12+ or 16+).', 'category' => 'Safari', 'featured' => false],
            ['question' => 'What is the accommodation like on safari?', 'answer' => 'Accommodation ranges from budget camping to luxury lodges. Options include tented camps (permanent tents with beds and bathrooms), safari lodges (permanent buildings with full amenities), and mobile camps (moving with the migration). All our recommended accommodations have en-suite facilities.', 'category' => 'Safari', 'featured' => false],
            ['question' => 'How do I book a safari with you?', 'answer' => 'You can book through our website, email, or phone. We\'ll discuss your preferences, suggest itineraries, and provide a quote. A 30% deposit secures your booking, with the balance due 60 days before travel. We offer flexible payment options and can customize any itinerary.', 'category' => 'Booking', 'featured' => true],
        ];

        foreach ($faqs as $index => $faq) {
            Faq::create([
                'question' => $faq['question'],
                'answer' => $faq['answer'],
                'category' => $faq['category'],
                'featured' => $faq['featured'],
                'active' => true,
                'sort_order' => $index,
            ]);
        }

        $this->command->info('10 FAQs created successfully!');
    }
}
