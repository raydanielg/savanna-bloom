<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_reference', 'user_id', 'bookable_type', 'bookable_id',
        'customer_name', 'customer_email', 'customer_phone', 'customer_country',
        'start_date', 'end_date', 'adults', 'children', 'total_guests',
        'special_requests', 'total_amount', 'paid_amount', 'currency',
        'payment_status', 'status', 'metadata', 'confirmed_at', 'cancelled_at',
        'cancellation_reason'
    ];

    protected $casts = [
        'metadata' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookable()
    {
        return $this->morphTo();
    }

    public function testimonial()
    {
        return $this->hasOne(Testimonial::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function generateReference()
    {
        return 'SB-' . strtoupper(uniqid());
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($booking) {
            if (empty($booking->booking_reference)) {
                $booking->booking_reference = $booking->generateReference();
            }
        });
    }
}
