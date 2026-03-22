<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Safari;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SafariController extends Controller
{
    public function index(Request $request)
    {
        $query = Safari::with('destination');
        
        if ($request->has('featured')) {
            $query->featured();
        }
        
        if ($request->has('active')) {
            $query->active();
        }
        
        $safaris = $query->orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return response()->json($safaris);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:safaris,slug',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'days' => 'nullable|integer',
            'price' => 'nullable|numeric',
            'currency' => 'nullable|string|size:3',
            'image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'highlights' => 'nullable|array',
            'included' => 'nullable|array',
            'excluded' => 'nullable|array',
            'difficulty' => 'nullable|string|max:255',
            'min_guests' => 'nullable|integer',
            'max_guests' => 'nullable|integer',
            'destination_id' => 'nullable|exists:destinations,id',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $safari = Safari::create($validated);
        return response()->json($safari->load('destination'), 201);
    }

    public function show($id)
    {
        $safari = Safari::with('destination')->findOrFail($id);
        return response()->json($safari);
    }

    public function update(Request $request, $id)
    {
        $safari = Safari::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:safaris,slug,' . $id,
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'days' => 'nullable|integer',
            'price' => 'nullable|numeric',
            'currency' => 'nullable|string|size:3',
            'image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'highlights' => 'nullable|array',
            'included' => 'nullable|array',
            'excluded' => 'nullable|array',
            'difficulty' => 'nullable|string|max:255',
            'min_guests' => 'nullable|integer',
            'max_guests' => 'nullable|integer',
            'destination_id' => 'nullable|exists:destinations,id',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        $safari->update($validated);
        return response()->json($safari->load('destination'));
    }

    public function categories()
    {
        $categories = Safari::select('category')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');
        return response()->json($categories);
    }

    public function destroy($id)
    {
        $safari = Safari::findOrFail($id);
        $safari->delete();
        return response()->json(['message' => 'Safari deleted successfully']);
    }
}
