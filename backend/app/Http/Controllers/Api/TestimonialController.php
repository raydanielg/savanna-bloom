<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $query = Testimonial::with('bookable');
        
        if ($request->has('featured')) {
            $query->featured();
        }
        
        if ($request->has('approved')) {
            $query->approved();
        }
        
        $testimonials = $query->orderBy('created_at', 'desc')->get();
        return response()->json($testimonials);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:500',
            'rating' => 'nullable|numeric|min:1|max:5',
            'text' => 'required|string',
            'bookable_type' => 'nullable|string',
            'bookable_id' => 'nullable|integer',
            'booking_id' => 'nullable|exists:bookings,id',
            'featured' => 'nullable|boolean',
            'approved' => 'nullable|boolean',
        ]);

        $testimonial = Testimonial::create($validated);
        return response()->json($testimonial, 201);
    }

    public function show($id)
    {
        $testimonial = Testimonial::with(['bookable', 'booking'])->findOrFail($id);
        return response()->json($testimonial);
    }

    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'location' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:500',
            'rating' => 'nullable|numeric|min:1|max:5',
            'text' => 'sometimes|string',
            'bookable_type' => 'nullable|string',
            'bookable_id' => 'nullable|integer',
            'booking_id' => 'nullable|exists:bookings,id',
            'featured' => 'nullable|boolean',
            'approved' => 'nullable|boolean',
        ]);

        $testimonial->update($validated);
        return response()->json($testimonial);
    }

    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();
        return response()->json(['message' => 'Testimonial deleted successfully']);
    }
    
    public function approve($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update(['approved' => true]);
        return response()->json($testimonial);
    }
    
    public function feature($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update(['featured' => true]);
        return response()->json($testimonial);
    }
}
