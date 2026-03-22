<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Safari extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'short_description', 'description', 'category',
        'duration', 'days', 'price', 'currency', 'image', 'gallery',
        'highlights', 'included', 'excluded', 'difficulty', 'min_guests',
        'max_guests', 'destination_id', 'featured', 'active', 'sort_order',
        'meta_title', 'meta_description'
    ];

    protected $casts = [
        'gallery' => 'array',
        'highlights' => 'array',
        'included' => 'array',
        'excluded' => 'array',
        'featured' => 'boolean',
        'active' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function bookings()
    {
        return $this->morphMany(Booking::class, 'bookable');
    }

    public function inquiries()
    {
        return $this->morphMany(Inquiry::class, 'bookable');
    }

    public function testimonials()
    {
        return $this->morphMany(Testimonial::class, 'bookable');
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
