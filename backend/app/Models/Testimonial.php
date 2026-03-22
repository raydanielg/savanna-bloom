<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name', 'location', 'country', 'avatar', 'rating', 'text',
        'bookable_type', 'bookable_id', 'booking_id', 'featured', 'approved'
    ];

    protected $casts = [
        'rating' => 'decimal:1',
        'featured' => 'boolean',
        'approved' => 'boolean',
    ];

    public function bookable()
    {
        return $this->morphTo();
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('approved', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }
}
