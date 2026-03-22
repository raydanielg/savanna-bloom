<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Destination extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'subtitle', 'short_description', 'description',
        'image', 'gallery', 'region', 'country', 'latitude', 'longitude',
        'highlights', 'wildlife', 'best_time', 'tours_count', 'featured',
        'active', 'sort_order', 'meta_title', 'meta_description'
    ];

    protected $casts = [
        'gallery' => 'array',
        'highlights' => 'array',
        'wildlife' => 'array',
        'featured' => 'boolean',
        'active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function safaris()
    {
        return $this->hasMany(Safari::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }
}
