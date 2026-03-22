<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogPost extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'author_id', 'title', 'slug', 'excerpt', 'content',
        'featured_image', 'gallery', 'category', 'tags',
        'featured', 'published', 'published_at', 'views',
        'meta_title', 'meta_description'
    ];

    protected $casts = [
        'gallery' => 'array',
        'tags' => 'array',
        'featured' => 'boolean',
        'published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function incrementViews()
    {
        $this->increment('views');
    }
}
