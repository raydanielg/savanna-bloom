<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PackageController extends Controller
{
    /**
     * Display a listing of packages.
     */
    public function index(Request $request)
    {
        $query = Package::with('destination');

        // Filter by active status for public API
        if (!$request->user()) {
            $query->active();
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by destination
        if ($request->has('destination_id') && $request->destination_id) {
            $query->where('destination_id', $request->destination_id);
        }

        // Filter by featured
        if ($request->has('featured') && $request->featured) {
            $query->featured();
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by duration
        if ($request->has('duration')) {
            $query->where('duration_days', '<=', $request->duration);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'sort_order');
        $sortOrder = $request->get('sort_order', 'asc');
        
        if ($sortBy === 'price') {
            $query->orderBy('price', $sortOrder);
        } elseif ($sortBy === 'duration') {
            $query->orderBy('duration_days', $sortOrder);
        } else {
            $query->ordered();
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $packages = $query->paginate($perPage);

        return response()->json($packages);
    }

    /**
     * Get featured packages.
     */
    public function featured()
    {
        $packages = Package::with('destination')
            ->active()
            ->featured()
            ->ordered()
            ->take(6)
            ->get();

        return response()->json($packages);
    }

    /**
     * Display the specified package.
     */
    public function show($slug)
    {
        $package = Package::with('destination')
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count or similar if needed
        // $package->increment('views');

        return response()->json($package);
    }

    /**
     * Store a newly created package.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:packages,slug',
            'subtitle' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:100',
            'destination_id' => 'nullable|exists:destinations,id',
            'duration_days' => 'nullable|integer|min:1',
            'duration_nights' => 'nullable|integer|min:0',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'difficulty' => 'nullable|string|max:50',
            'min_guests' => 'nullable|integer|min:1',
            'max_guests' => 'nullable|integer|min:1|gte:min_guests',
            'accommodation_type' => 'nullable|string|max:100',
            'highlights' => 'nullable|array',
            'highlights.*' => 'string',
            'includes' => 'nullable|array',
            'includes.*' => 'string',
            'excludes' => 'nullable|array',
            'excludes.*' => 'string',
            'itinerary' => 'nullable|array',
            'itinerary.*.day' => 'integer',
            'itinerary.*.title' => 'string',
            'itinerary.*.description' => 'string',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $package = Package::create($validated);

        return response()->json($package->load('destination'), 201);
    }

    /**
     * Update the specified package.
     */
    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('packages')->ignore($package->id)],
            'subtitle' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:100',
            'destination_id' => 'nullable|exists:destinations,id',
            'duration_days' => 'nullable|integer|min:1',
            'duration_nights' => 'nullable|integer|min:0',
            'price' => 'sometimes|required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'difficulty' => 'nullable|string|max:50',
            'min_guests' => 'nullable|integer|min:1',
            'max_guests' => 'nullable|integer|min:1|gte:min_guests',
            'accommodation_type' => 'nullable|string|max:100',
            'highlights' => 'nullable|array',
            'highlights.*' => 'string',
            'includes' => 'nullable|array',
            'includes.*' => 'string',
            'excludes' => 'nullable|array',
            'excludes.*' => 'string',
            'itinerary' => 'nullable|array',
            'itinerary.*.day' => 'integer',
            'itinerary.*.title' => 'string',
            'itinerary.*.description' => 'string',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $package->update($validated);

        return response()->json($package->load('destination'));
    }

    /**
     * Remove the specified package.
     */
    public function destroy($id)
    {
        $package = Package::findOrFail($id);
        $package->delete();

        return response()->json(['message' => 'Package deleted successfully']);
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured($id)
    {
        $package = Package::findOrFail($id);
        $package->featured = !$package->featured;
        $package->save();

        return response()->json($package);
    }

    /**
     * Get categories list.
     */
    public function categories()
    {
        $categories = Package::distinct()
            ->whereNotNull('category')
            ->pluck('category');

        return response()->json($categories);
    }
}
