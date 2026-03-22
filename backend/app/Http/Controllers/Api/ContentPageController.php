<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentPage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ContentPageController extends Controller
{
    public function index(Request $request)
    {
        $query = ContentPage::query();

        if (!$request->user()) {
            $query->active();
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show($slug)
    {
        $page = ContentPage::where('slug', $slug)->firstOrFail();
        return response()->json($page);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:content_pages,slug',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'active' => 'nullable|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        return response()->json(ContentPage::create($validated), 201);
    }

    public function update(Request $request, $id)
    {
        $page = ContentPage::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'active' => 'nullable|boolean',
        ]);

        $page->update($validated);
        return response()->json($page);
    }

    public function destroy($id)
    {
        ContentPage::findOrFail($id)->delete();
        return response()->json(['message' => 'Content page deleted successfully']);
    }
}
