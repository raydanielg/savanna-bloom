<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = Gallery::with('destination');

        if (!$request->user()) {
            $query->active();
        }

        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        if ($request->has('featured') && $request->featured) {
            $query->featured();
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 20);
        return response()->json($query->ordered()->paginate($perPage));
    }

    public function featured()
    {
        return response()->json(Gallery::with('destination')->active()->featured()->ordered()->take(12)->get());
    }

    public function show($id)
    {
        return response()->json(Gallery::with('destination')->findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:galleries,slug',
            'description' => 'nullable|string',
            'image' => 'required|string|max:500',
            'category' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
            'destination_id' => 'nullable|exists:destinations,id',
            'tags' => 'nullable|string',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        return response()->json(Gallery::create($validated), 201);
    }

    public function update(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
            'destination_id' => 'nullable|exists:destinations,id',
            'tags' => 'nullable|string',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $gallery->update($validated);
        return response()->json($gallery->load('destination'));
    }

    public function destroy($id)
    {
        Gallery::findOrFail($id)->delete();
        return response()->json(['message' => 'Gallery item deleted successfully']);
    }

    public function toggleFeatured($id)
    {
        $gallery = Gallery::findOrFail($id);
        $gallery->featured = !$gallery->featured;
        $gallery->save();
        return response()->json($gallery);
    }
}
