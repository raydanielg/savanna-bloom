<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'bookable']);
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }
        
        $bookings = $query->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bookable_type' => 'required|string',
            'bookable_id' => 'required|integer',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'customer_country' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'adults' => 'nullable|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'total_guests' => 'nullable|integer|min:1',
            'special_requests' => 'nullable|string',
            'total_amount' => 'nullable|numeric',
            'paid_amount' => 'nullable|numeric',
            'currency' => 'nullable|string|size:3',
            'payment_status' => 'nullable|string|in:unpaid,partial,paid,refunded',
            'status' => 'nullable|string|in:pending,confirmed,cancelled,completed',
            'metadata' => 'nullable|array',
        ]);

        $booking = Booking::create($validated);
        return response()->json($booking->load(['user', 'bookable']), 201);
    }

    public function show($id)
    {
        $booking = Booking::with(['user', 'bookable'])->findOrFail($id);
        return response()->json($booking);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        
        $validated = $request->validate([
            'customer_name' => 'sometimes|string|max:255',
            'customer_email' => 'sometimes|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'customer_country' => 'nullable|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
            'adults' => 'nullable|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'total_guests' => 'nullable|integer|min:1',
            'special_requests' => 'nullable|string',
            'total_amount' => 'nullable|numeric',
            'paid_amount' => 'nullable|numeric',
            'currency' => 'nullable|string|size:3',
            'payment_status' => 'nullable|string|in:unpaid,partial,paid,refunded',
            'status' => 'nullable|string|in:pending,confirmed,cancelled,completed',
            'metadata' => 'nullable|array',
            'confirmed_at' => 'nullable|date',
            'cancelled_at' => 'nullable|date',
            'cancellation_reason' => 'nullable|string',
        ]);

        $booking->update($validated);
        return response()->json($booking->load(['user', 'bookable']));
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();
        return response()->json(['message' => 'Booking deleted successfully']);
    }

    public function sendEmail(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        Mail::raw($validated['message'], function ($message) use ($validated, $booking) {
            $message->to($booking->customer_email)
                ->subject($validated['subject']);
        });

        return response()->json(['message' => 'Email sent successfully']);
    }
}
