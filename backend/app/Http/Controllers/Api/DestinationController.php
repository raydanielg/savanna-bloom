<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    public function index(Request $request)
    {
        $query = Destination::query();
        
        if ($request->has('featured')) {
            $query->featured();
        }
        
        if ($request->has('active')) {
            $query->active();
        }
        
        $destinations = $query->orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return response()->json($destinations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:destinations,slug',
            'subtitle' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'region' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'highlights' => 'nullable|array',
            'wildlife' => 'nullable|array',
            'best_time' => 'nullable|string|max:255',
            'tours_count' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $destination = Destination::create($validated);
        return response()->json($destination, 201);
    }

    public function show($id)
    {
        $destination = Destination::with('safaris')->findOrFail($id);
        return response()->json($destination);
    }

    public function update(Request $request, $id)
    {
        $destination = Destination::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:destinations,slug,' . $id,
            'subtitle' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'region' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'highlights' => 'nullable|array',
            'wildlife' => 'nullable|array',
            'best_time' => 'nullable|string|max:255',
            'tours_count' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        $destination->update($validated);
        return response()->json($destination);
    }

    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();
        return response()->json(['message' => 'Destination deleted successfully']);
    }
}
