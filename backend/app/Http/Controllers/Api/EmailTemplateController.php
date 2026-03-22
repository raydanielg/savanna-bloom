<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    /**
     * List all email templates.
     */
    public function index()
    {
        return response()->json(EmailTemplate::orderBy('name')->get());
    }

    /**
     * Get a specific template.
     */
    public function show($id)
    {
        return response()->json(EmailTemplate::findOrFail($id));
    }

    /**
     * Create a new template.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:email_templates,slug',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'variables' => 'nullable|array',
            'active' => 'nullable|boolean',
        ]);

        $template = EmailTemplate::create($validated);

        return response()->json($template, 201);
    }

    /**
     * Update a template.
     */
    public function update(Request $request, $id)
    {
        $template = EmailTemplate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'subject' => 'sometimes|required|string|max:255',
            'body' => 'sometimes|required|string',
            'variables' => 'nullable|array',
            'active' => 'nullable|boolean',
        ]);

        $template->update($validated);

        return response()->json($template);
    }

    /**
     * Delete a template.
     */
    public function destroy($id)
    {
        $template = EmailTemplate::findOrFail($id);
        $template->delete();

        return response()->json(['message' => 'Template deleted successfully']);
    }

    /**
     * Preview a template with sample data.
     */
    public function preview($id)
    {
        $template = EmailTemplate::findOrFail($id);

        // Sample data for preview
        $sampleData = [
            'site_name' => 'Savanna Bloom',
            'customer_name' => 'John Doe',
            'package_name' => 'Serengeti Safari',
            'booking_date' => '2024-06-15',
            'number_of_guests' => '4',
            'total_amount' => '$5,000',
            'message' => 'I would like to know more about your safaris.',
            'reply_message' => 'Thank you for your interest! Here are the details...',
            'user_name' => 'John Doe',
            'reset_link' => 'https://example.com/reset-password?token=abc123',
        ];

        $parsed = $template->parse($sampleData);

        return response()->json([
            'subject' => $parsed['subject'],
            'body' => $parsed['body'],
        ]);
    }
}
