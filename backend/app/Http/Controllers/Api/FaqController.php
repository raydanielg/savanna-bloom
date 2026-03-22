<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::query();

        if (!$request->user()) {
            $query->active();
        }

        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                  ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        return response()->json($query->ordered()->get());
    }

    public function categories()
    {
        return response()->json(Faq::distinct()->whereNotNull('category')->pluck('category'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:100',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        return response()->json(Faq::create($validated), 201);
    }

    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'question' => 'sometimes|required|string|max:500',
            'answer' => 'sometimes|required|string',
            'category' => 'nullable|string|max:100',
            'featured' => 'nullable|boolean',
            'active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $faq->update($validated);
        return response()->json($faq);
    }

    public function destroy($id)
    {
        Faq::findOrFail($id)->delete();
        return response()->json(['message' => 'FAQ deleted successfully']);
    }
}
