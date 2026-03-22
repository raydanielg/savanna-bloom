<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'subject',
        'body',
        'variables',
        'active',
    ];

    protected $casts = [
        'variables' => 'array',
        'active' => 'boolean',
    ];

    public static function findBySlug($slug)
    {
        return static::where('slug', $slug)->where('active', true)->first();
    }

    public function parse($data = [])
    {
        $body = $this->body;
        $subject = $this->subject;

        foreach ($data as $key => $value) {
            $body = str_replace("{{{$key}}}", $value, $body);
            $subject = str_replace("{{{$key}}}", $value, $subject);
        }

        return [
            'subject' => $subject,
            'body' => $body,
        ];
    }
}
