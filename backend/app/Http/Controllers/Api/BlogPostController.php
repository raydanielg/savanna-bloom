<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::with('author');
        
        if ($request->has('published')) {
            $query->published();
        }
        
        if ($request->has('featured')) {
            $query->featured();
        }
        
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        $posts = $query->orderBy('published_at', 'desc')->orderBy('created_at', 'desc')->get();
        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:blog_posts,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'featured' => 'nullable|boolean',
            'published' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }
        
        $validated['author_id'] = auth()->id();

        $post = BlogPost::create($validated);
        return response()->json($post->load('author'), 201);
    }

    public function show($id)
    {
        $post = BlogPost::with('author')->findOrFail($id);
        $post->incrementViews();
        return response()->json($post);
    }

    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:blog_posts,slug,' . $id,
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|string',
            'featured_image' => 'nullable|string|max:500',
            'gallery' => 'nullable|array',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'featured' => 'nullable|boolean',
            'published' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        $post->update($validated);
        return response()->json($post->load('author'));
    }

    public function destroy($id)
    {
        $post = BlogPost::findOrFail($id);
        $post->delete();
        return response()->json(['message' => 'Blog post deleted successfully']);
    }
    
    public function publish($id)
    {
        $post = BlogPost::findOrFail($id);
        $post->update([
            'published' => true,
            'published_at' => now(),
        ]);
        return response()->json($post->load('author'));
    }
    
    public function unpublish($id)
    {
        $post = BlogPost::findOrFail($id);
        $post->update(['published' => false]);
        return response()->json($post->load('author'));
    }
}
