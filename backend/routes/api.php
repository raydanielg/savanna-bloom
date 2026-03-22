<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SafariController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\KilimanjaroRouteController;
use App\Http\Controllers\Api\DayTripController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\ContentPageController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\EmailTemplateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum'])->get('/user', [AuthController::class, 'user']);

// Public API routes
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{id}', [DestinationController::class, 'show']);
Route::get('/safaris', [SafariController::class, 'index']);
Route::get('/safaris/categories', [SafariController::class, 'categories']);
Route::get('/safaris/{id}', [SafariController::class, 'show']);
Route::get('/kilimanjaro-routes', [KilimanjaroRouteController::class, 'index']);
Route::get('/kilimanjaro-routes/{id}', [KilimanjaroRouteController::class, 'show']);
Route::get('/day-trips', [DayTripController::class, 'index']);
Route::get('/day-trips/{id}', [DayTripController::class, 'show']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{id}', [TestimonialController::class, 'show']);
Route::get('/blog-posts', [BlogPostController::class, 'index']);
Route::get('/blog-posts/{id}', [BlogPostController::class, 'show']);

// Public package routes
Route::get('/packages', [PackageController::class, 'index']);
Route::get('/packages/featured', [PackageController::class, 'featured']);
Route::get('/packages/categories', [PackageController::class, 'categories']);
Route::get('/packages/{slug}', [PackageController::class, 'show']);

// Public gallery routes
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/gallery/featured', [GalleryController::class, 'featured']);
Route::get('/gallery/{id}', [GalleryController::class, 'show']);

// Public FAQ routes
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/faqs/categories', [FaqController::class, 'categories']);

// Public content pages
Route::get('/content/{slug}', [ContentPageController::class, 'show']);

// Public settings
Route::get('/settings/public', [SettingController::class, 'public']);

// Public inquiry submission
Route::post('/inquiries', [InquiryController::class, 'store']);

// Protected admin routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Users
    Route::apiResource('admin/users', UserController::class);
    
    // Admin CRUD routes
    Route::apiResource('admin/destinations', DestinationController::class)->except(['index', 'show']);
    Route::apiResource('admin/safaris', SafariController::class)->except(['index', 'show']);
    Route::apiResource('admin/kilimanjaro-routes', KilimanjaroRouteController::class)->except(['index', 'show']);
    Route::apiResource('admin/day-trips', DayTripController::class)->except(['show']);
    Route::post('admin/day-trips/{id}/feature', [DayTripController::class, 'toggleFeatured']);
    Route::apiResource('admin/bookings', BookingController::class);
    Route::post('admin/bookings/{booking}/email', [BookingController::class, 'sendEmail']);
    Route::apiResource('admin/inquiries', InquiryController::class);
    Route::apiResource('admin/testimonials', TestimonialController::class)->except(['index', 'show']);
    Route::apiResource('admin/blog-posts', BlogPostController::class)->except(['index', 'show']);
    Route::apiResource('admin/packages', PackageController::class)->except(['show']);
    Route::apiResource('admin/gallery', GalleryController::class)->except(['index', 'show']);
    Route::apiResource('admin/faqs', FaqController::class)->except(['index', 'show']);
    Route::apiResource('admin/content', ContentPageController::class)->except(['index', 'show']);
    Route::apiResource('admin/email-templates', EmailTemplateController::class)->except(['index', 'show']);
    
    // Settings routes
    Route::get('admin/settings', [SettingController::class, 'index']);
    Route::post('admin/settings', [SettingController::class, 'update']);
    Route::put('admin/settings/{key}', [SettingController::class, 'updateSingle']);
    Route::post('admin/settings/toggle-maintenance', [SettingController::class, 'toggleMaintenance']);
    Route::get('admin/settings/group/{group}', [SettingController::class, 'getGroup']);
    Route::get('admin/email-templates/{id}/preview', [EmailTemplateController::class, 'preview']);
    
    // Additional admin actions
    Route::post('admin/inquiries/{id}/read', [InquiryController::class, 'markAsRead']);
    Route::post('admin/inquiries/{id}/reply', [InquiryController::class, 'reply']);
    Route::post('admin/testimonials/{id}/approve', [TestimonialController::class, 'approve']);
    Route::post('admin/testimonials/{id}/feature', [TestimonialController::class, 'feature']);
    Route::post('admin/blog-posts/{id}/publish', [BlogPostController::class, 'publish']);
    Route::post('admin/blog-posts/{id}/unpublish', [BlogPostController::class, 'unpublish']);
    Route::post('admin/packages/{id}/feature', [PackageController::class, 'toggleFeatured']);
    Route::post('admin/gallery/{id}/feature', [GalleryController::class, 'toggleFeatured']);
});
