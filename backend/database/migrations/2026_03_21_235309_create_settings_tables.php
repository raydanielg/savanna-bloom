<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('text'); // text, textarea, boolean, image, json
            $table->string('group')->default('general'); // general, smtp, appearance, maintenance
            $table->string('label')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        $settings = [
            // General Settings
            ['key' => 'site_name', 'value' => 'Savanna Bloom', 'type' => 'text', 'group' => 'general', 'label' => 'Site Name', 'description' => 'The name of your website'],
            ['key' => 'site_tagline', 'value' => 'Discover Tanzania\'s Wild Beauty', 'type' => 'text', 'group' => 'general', 'label' => 'Site Tagline', 'description' => 'A short description of your site'],
            ['key' => 'site_email', 'value' => 'info@savannabloom.com', 'type' => 'text', 'group' => 'general', 'label' => 'Site Email', 'description' => 'Main contact email'],
            ['key' => 'site_phone', 'value' => '+255 123 456 789', 'type' => 'text', 'group' => 'general', 'label' => 'Site Phone', 'description' => 'Main contact phone'],
            ['key' => 'site_address', 'value' => 'Arusha, Tanzania', 'type' => 'textarea', 'group' => 'general', 'label' => 'Site Address', 'description' => 'Physical address'],
            ['key' => 'social_facebook', 'value' => '', 'type' => 'text', 'group' => 'general', 'label' => 'Facebook URL', 'description' => 'Facebook page URL'],
            ['key' => 'social_instagram', 'value' => '', 'type' => 'text', 'group' => 'general', 'label' => 'Instagram URL', 'description' => 'Instagram profile URL'],
            ['key' => 'social_twitter', 'value' => '', 'type' => 'text', 'group' => 'general', 'label' => 'Twitter URL', 'description' => 'Twitter profile URL'],
            ['key' => 'social_youtube', 'value' => '', 'type' => 'text', 'group' => 'general', 'label' => 'YouTube URL', 'description' => 'YouTube channel URL'],
            
            // Appearance Settings
            ['key' => 'site_logo', 'value' => '', 'type' => 'image', 'group' => 'appearance', 'label' => 'Site Logo', 'description' => 'Upload your logo'],
            ['key' => 'site_favicon', 'value' => '', 'type' => 'image', 'group' => 'appearance', 'label' => 'Favicon', 'description' => 'Site favicon (32x32 px)'],
            ['key' => 'site_footer_text', 'value' => '© 2024 Savanna Bloom. All rights reserved.', 'type' => 'textarea', 'group' => 'appearance', 'label' => 'Footer Text', 'description' => 'Text displayed in footer'],
            ['key' => 'primary_color', 'value' => '#ea580c', 'type' => 'text', 'group' => 'appearance', 'label' => 'Primary Color', 'description' => 'Main brand color (hex)'],
            
            // Maintenance Settings
            ['key' => 'maintenance_mode', 'value' => 'false', 'type' => 'boolean', 'group' => 'maintenance', 'label' => 'Maintenance Mode', 'description' => 'Enable to show maintenance page to visitors'],
            ['key' => 'maintenance_message', 'value' => 'We are currently performing scheduled maintenance. Please check back soon.', 'type' => 'textarea', 'group' => 'maintenance', 'label' => 'Maintenance Message', 'description' => 'Message shown during maintenance'],
            ['key' => 'maintenance_end', 'value' => '', 'type' => 'text', 'group' => 'maintenance', 'label' => 'Expected End Time', 'description' => 'Estimated time maintenance will end'],
            
            // SMTP Settings
            ['key' => 'smtp_host', 'value' => '', 'type' => 'text', 'group' => 'smtp', 'label' => 'SMTP Host', 'description' => 'SMTP server hostname'],
            ['key' => 'smtp_port', 'value' => '587', 'type' => 'text', 'group' => 'smtp', 'label' => 'SMTP Port', 'description' => 'SMTP server port'],
            ['key' => 'smtp_username', 'value' => '', 'type' => 'text', 'group' => 'smtp', 'label' => 'SMTP Username', 'description' => 'SMTP authentication username'],
            ['key' => 'smtp_password', 'value' => '', 'type' => 'text', 'group' => 'smtp', 'label' => 'SMTP Password', 'description' => 'SMTP authentication password'],
            ['key' => 'smtp_encryption', 'value' => 'tls', 'type' => 'text', 'group' => 'smtp', 'label' => 'SMTP Encryption', 'description' => 'Encryption type (tls/ssl)'],
            ['key' => 'smtp_from_address', 'value' => 'noreply@savannabloom.com', 'type' => 'text', 'group' => 'smtp', 'label' => 'From Address', 'description' => 'Default sender email'],
            ['key' => 'smtp_from_name', 'value' => 'Savanna Bloom', 'type' => 'text', 'group' => 'smtp', 'label' => 'From Name', 'description' => 'Default sender name'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->insert($setting);
        }

        // Email Templates table
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('subject');
            $table->text('body');
            $table->text('variables')->nullable(); // JSON list of available variables
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // Insert default email templates
        $templates = [
            [
                'name' => 'Booking Confirmation',
                'slug' => 'booking-confirmation',
                'subject' => 'Your Safari Booking Confirmation - {{site_name}}',
                'body' => '<h2>Booking Confirmation</h2><p>Dear {{customer_name}},</p><p>Thank you for booking with {{site_name}}! Your booking has been confirmed.</p><p><strong>Booking Details:</strong></p><ul><li>Package: {{package_name}}</li><li>Date: {{booking_date}}</li><li>Guests: {{number_of_guests}}</li><li>Total: {{total_amount}}</li></ul><p>We will contact you shortly with more details.</p><p>Best regards,<br>{{site_name}} Team</p>',
                'variables' => json_encode(['customer_name', 'package_name', 'booking_date', 'number_of_guests', 'total_amount', 'site_name']),
            ],
            [
                'name' => 'Inquiry Received',
                'slug' => 'inquiry-received',
                'subject' => 'We received your inquiry - {{site_name}}',
                'body' => '<h2>Thank you for your inquiry</h2><p>Dear {{customer_name}},</p><p>We have received your inquiry and will get back to you within 24 hours.</p><p><strong>Your Message:</strong></p><p>{{message}}</p><p>Best regards,<br>{{site_name}} Team</p>',
                'variables' => json_encode(['customer_name', 'message', 'site_name']),
            ],
            [
                'name' => 'Inquiry Reply',
                'slug' => 'inquiry-reply',
                'subject' => 'Re: Your inquiry - {{site_name}}',
                'body' => '<h2>Response to Your Inquiry</h2><p>Dear {{customer_name}},</p><p>{{reply_message}}</p><p>Please feel free to reach out if you have any further questions.</p><p>Best regards,<br>{{site_name}} Team</p>',
                'variables' => json_encode(['customer_name', 'reply_message', 'site_name']),
            ],
            [
                'name' => 'Welcome Email',
                'slug' => 'welcome',
                'subject' => 'Welcome to {{site_name}}!',
                'body' => '<h2>Welcome to {{site_name}}!</h2><p>Dear {{user_name}},</p><p>Thank you for registering with us. We\'re excited to have you on board!</p><p>Explore our amazing safari packages and start planning your adventure.</p><p>Best regards,<br>{{site_name}} Team</p>',
                'variables' => json_encode(['user_name', 'site_name']),
            ],
            [
                'name' => 'Password Reset',
                'slug' => 'password-reset',
                'subject' => 'Reset Your Password - {{site_name}}',
                'body' => '<h2>Password Reset Request</h2><p>Hello,</p><p>You requested to reset your password. Click the link below to proceed:</p><p><a href="{{reset_link}}">Reset Password</a></p><p>This link will expire in 60 minutes.</p><p>If you did not request this, please ignore this email.</p><p>Best regards,<br>{{site_name}} Team</p>',
                'variables' => json_encode(['reset_link', 'site_name']),
            ],
        ];

        foreach ($templates as $template) {
            DB::table('email_templates')->insert($template);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('email_templates');
        Schema::dropIfExists('settings');
    }
};
