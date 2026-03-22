<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KilimanjaroRoute;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KilimanjaroRouteController extends Controller
{
    public function index(Request $request)
    {
        $query = KilimanjaroRoute::query();
        
        if ($request->has('featured')) {
            $query->featured();
        }
        
        if ($request->has('active')) {
            $query->active();
        }
        
        $routes = $query->orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return response()->json($routes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:kilimanjaro_routes,slug',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'days' => 'nullable|integer',
            'difficulty' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'currency' => 'nullable|string|size:3',
            'image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'highlights' => 'nullable|array',
            'included' => 'nullable|array',
            'excluded' => 'nullable|array',
            'itinerary' => 'nullable|string',
            'success_rate' => 'nullable|numeric',
            'min_age' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $route = KilimanjaroRoute::create($validated);
        return response()->json($route, 201);
    }

    public function show($id)
    {
        $route = KilimanjaroRoute::findOrFail($id);
        return response()->json($route);
    }

    public function update(Request $request, $id)
    {
        $route = KilimanjaroRoute::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:kilimanjaro_routes,slug,' . $id,
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'days' => 'nullable|integer',
            'difficulty' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'currency' => 'nullable|string|size:3',
            'image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'highlights' => 'nullable|array',
            'included' => 'nullable|array',
            'excluded' => 'nullable|array',
            'itinerary' => 'nullable|string',
            'success_rate' => 'nullable|numeric',
            'min_age' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        $route->update($validated);
        return response()->json($route);
    }

    public function destroy($id)
    {
        $route = KilimanjaroRoute::findOrFail($id);
        $route->delete();
        return response()->json(['message' => 'Route deleted successfully']);
    }
}
