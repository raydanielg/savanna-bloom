<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index(Request $request)
    {
        $query = Inquiry::with('repliedBy');
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('inquiry_type')) {
            $query->where('inquiry_type', $request->inquiry_type);
        }
        
        $inquiries = $query->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($inquiries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'inquiry_type' => 'nullable|string|max:255',
            'bookable_type' => 'nullable|string',
            'bookable_id' => 'nullable|integer',
            'message' => 'required|string',
            'preferred_date' => 'nullable|date',
            'guests' => 'nullable|string',
            'accommodation' => 'nullable|string|max:255',
        ]);

        $inquiry = Inquiry::create($validated);
        return response()->json($inquiry, 201);
    }

    public function show($id)
    {
        $inquiry = Inquiry::with(['repliedBy', 'bookable'])->findOrFail($id);
        return response()->json($inquiry);
    }

    public function update(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'inquiry_type' => 'nullable|string|max:255',
            'message' => 'sometimes|string',
            'preferred_date' => 'nullable|date',
            'guests' => 'nullable|string',
            'accommodation' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:new,read,replied,closed',
            'notes' => 'nullable|string',
        ]);

        $inquiry->update($validated);
        return response()->json($inquiry->load('repliedBy'));
    }

    public function destroy($id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiry->delete();
        return response()->json(['message' => 'Inquiry deleted successfully']);
    }
    
    public function markAsRead($id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiry->update(['status' => 'read']);
        return response()->json($inquiry);
    }
    
    public function reply(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        
        $validated = $request->validate([
            'notes' => 'required|string',
        ]);
        
        $inquiry->update([
            'status' => 'replied',
            'notes' => $validated['notes'],
            'replied_at' => now(),
            'replied_by' => auth()->id(),
        ]);
        
        return response()->json($inquiry->load('repliedBy'));
    }
}
