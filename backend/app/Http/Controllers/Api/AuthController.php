<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
            'role' => 'user',
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid email or password.'
            ], 401);
        }

        $user = Auth::user();

        if ($user->role !== 'admin') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return response()->json([
                'message' => 'Unauthorized. Only admins can sign in.'
            ], 403);
        }

        // Regenerate session ID to prevent session fixation
        $request->session()->regenerate();

        $cookieDomain = config('session.domain');
        $isSecure = config('session.secure');
        $sameSite = config('session.same_site');

        return response()->json([
            'user' => $user,
            'message' => 'Login successful'
        ])
        ->withCookie(cookie(
            'XSRF-TOKEN',
            $request->session()->token(),
            10080, // 7 days
            '/',
            $cookieDomain,
            $isSecure,
            false, // httpOnly must be false for XSRF-TOKEN so JS can read it
            false,
            $sameSite
        ))
        ->withCookie(cookie(
            config('session.cookie'),
            $request->session()->getId(),
            10080, // 7 days
            '/',
            $cookieDomain,
            $isSecure,
            true, // httpOnly true for session security
            false,
            $sameSite
        ));
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
