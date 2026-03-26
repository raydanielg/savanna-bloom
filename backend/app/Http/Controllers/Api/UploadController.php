<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'path' => 'nullable|string'
        ]);

        if ($request->file('image')) {
            $path = $request->input('path', 'uploads');
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = Str::random(20) . '.' . $extension;
            
            $filePath = $file->storeAs($path, $filename, 'public');
            
            return response()->json([
                'url' => 'storage/' . $filePath,
                'path' => $filePath,
                'status' => 'success'
            ]);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }
}
