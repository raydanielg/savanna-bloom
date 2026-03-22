<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'label',
        'description',
    ];

    public static function get($key, $default = null)
    {
        return Cache::remember("setting.{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    public static function set($key, $value)
    {
        $setting = static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("setting.{$key}");
        return $setting;
    }

    public static function getGroup($group)
    {
        return static::where('group', $group)->get()->pluck('value', 'key');
    }

    public static function getAll()
    {
        return Cache::remember('settings.all', 3600, function () {
            return static::all()->keyBy('key');
        });
    }

    public static function flushCache()
    {
        $keys = static::pluck('key');
        foreach ($keys as $key) {
            Cache::forget("setting.{$key}");
        }
        Cache::forget('settings.all');
    }
}
