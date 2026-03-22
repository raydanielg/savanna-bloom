<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get all settings grouped.
     */
    public function index()
    {
        $settings = Setting::all()->groupBy('group');
        $templates = EmailTemplate::all();

        return response()->json([
            'settings' => $settings,
            'templates' => $templates,
        ]);
    }

    /**
     * Get settings by group.
     */
    public function getGroup($group)
    {
        $settings = Setting::where('group', $group)->get();
        return response()->json($settings);
    }

    /**
     * Update settings.
     */
    public function update(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Setting::flushCache();

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => Setting::all()->groupBy('group'),
        ]);
    }

    /**
     * Update a single setting.
     */
    public function updateSingle(Request $request, $key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        $setting->value = $request->value;
        $setting->save();

        Setting::flushCache();

        return response()->json($setting);
    }

    /**
     * Toggle maintenance mode.
     */
    public function toggleMaintenance()
    {
        $current = Setting::get('maintenance_mode', 'false');
        $newValue = $current === 'true' ? 'false' : 'true';
        
        Setting::set('maintenance_mode', $newValue);
        Setting::flushCache();

        return response()->json([
            'maintenance_mode' => $newValue,
            'message' => $newValue === 'true' ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
        ]);
    }

    /**
     * Get public settings (for frontend).
     */
    public function public()
    {
        return response()->json([
            'site_name' => Setting::get('site_name'),
            'site_tagline' => Setting::get('site_tagline'),
            'site_email' => Setting::get('site_email'),
            'site_phone' => Setting::get('site_phone'),
            'site_address' => Setting::get('site_address'),
            'site_logo' => Setting::get('site_logo'),
            'site_favicon' => Setting::get('site_favicon'),
            'primary_color' => Setting::get('primary_color'),
            'social_facebook' => Setting::get('social_facebook'),
            'social_instagram' => Setting::get('social_instagram'),
            'social_twitter' => Setting::get('social_twitter'),
            'social_youtube' => Setting::get('social_youtube'),
            'maintenance_mode' => Setting::get('maintenance_mode', 'false'),
            'maintenance_message' => Setting::get('maintenance_message'),
        ]);
    }
}
