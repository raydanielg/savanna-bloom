<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'country', 'subject', 'inquiry_type',
        'bookable_type', 'bookable_id', 'message', 'preferred_date',
        'guests', 'status', 'accommodation', 'notes', 'replied_at', 'replied_by'
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'replied_at' => 'datetime',
    ];

    public function bookable()
    {
        return $this->morphTo();
    }

    public function repliedBy()
    {
        return $this->belongsTo(User::class, 'replied_by');
    }

    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeRead($query)
    {
        return $query->where('status', 'read');
    }

    public function scopeReplied($query)
    {
        return $query->where('status', 'replied');
    }
}
