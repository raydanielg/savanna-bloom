<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'subtitle',
        'short_description',
        'description',
        'image',
        'category',
        'destination_id',
        'duration_days',
        'duration_nights',
        'price',
        'currency',
        'discount_price',
        'difficulty',
        'min_guests',
        'max_guests',
        'accommodation_type',
        'highlights',
        'includes',
        'excludes',
        'itinerary',
        'featured',
        'active',
        'sort_order',
    ];

    protected $casts = [
        'highlights' => 'array',
        'includes' => 'array',
        'excludes' => 'array',
        'itinerary' => 'array',
        'featured' => 'boolean',
        'active' => 'boolean',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($package) {
            if (empty($package->slug)) {
                $package->slug = Str::slug($package->name);
            }
        });

        static::updating(function ($package) {
            if ($package->isDirty('name') && empty($package->slug)) {
                $package->slug = Str::slug($package->name);
            }
        });
    }

    /**
     * Get the destination that the package belongs to.
     */
    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    /**
     * Get the bookings for the package.
     */
    public function bookings()
    {
        return $this->morphMany(Booking::class, 'bookable');
    }

    /**
     * Get the effective price (discount if available).
     */
    public function getEffectivePriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    /**
     * Check if package has discount.
     */
    public function getHasDiscountAttribute()
    {
        return $this->discount_price && $this->discount_price < $this->price;
    }

    /**
     * Get discount percentage.
     */
    public function getDiscountPercentageAttribute()
    {
        if ($this->has_discount) {
            return round((1 - $this->discount_price / $this->price) * 100);
        }
        return 0;
    }

    /**
     * Get duration string.
     */
    public function getDurationStringAttribute()
    {
        return "{$this->duration_days} Days, {$this->duration_nights} Nights";
    }

    /**
     * Scope for active packages.
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope for featured packages.
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope for ordered packages.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }
}
