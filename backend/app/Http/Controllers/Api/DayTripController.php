<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DayTrip;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DayTripController extends Controller
{
    public function index(Request $request)
    {
        $query = DayTrip::query();
        
        if ($request->has('featured')) {
            $query->featured();
        }
        
        if ($request->has('active')) {
            $query->active();
        }
        
        $trips = $query->orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return response()->json($trips);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:day_trips,slug',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'currency' => 'nullable|string|size:3',
            'duration' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'highlights' => 'nullable|array',
            'included' => 'nullable|array',
            'excluded' => 'nullable|array',
            'location' => 'nullable|string|max:255',
            'min_guests' => 'nullable|integer',
            'max_guests' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $trip = DayTrip::create($validated);
        return response()->json($trip, 201);
    }

    public function show($id)
    {
        $trip = DayTrip::findOrFail($id);
        return response()->json($trip);
    }

    public function update(Request $request, $id)
    {
        $trip = DayTrip::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:day_trips,slug,' . $id,
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'currency' => 'nullable|string|size:3',
            'duration' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'highlights' => 'nullable|array',
            'included' => 'nullable|array',
            'excluded' => 'nullable|array',
            'location' => 'nullable|string|max:255',
            'min_guests' => 'nullable|integer',
            'max_guests' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        $trip->update($validated);
        return response()->json($trip);
    }

    public function destroy($id)
    {
        $trip = DayTrip::findOrFail($id);
        $trip->delete();
        return response()->json(['message' => 'Day trip deleted successfully']);
    }

    public function toggleFeatured($id)
    {
        $trip = DayTrip::findOrFail($id);
        $trip->featured = !$trip->featured;
        $trip->save();
        return response()->json([
            'message' => $trip->featured ? 'Day trip marked as featured' : 'Day trip removed from featured',
            'featured' => $trip->featured
        ]);
    }
}
