<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('category')->default('Safari');
            $table->foreignId('destination_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('duration_days')->default(1);
            $table->integer('duration_nights')->default(0);
            $table->decimal('price', 12, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->decimal('discount_price', 12, 2)->nullable();
            $table->string('difficulty', 50)->nullable();
            $table->integer('min_guests')->default(1);
            $table->integer('max_guests')->default(20);
            $table->string('accommodation_type')->nullable();
            $table->json('highlights')->nullable();
            $table->json('includes')->nullable();
            $table->json('excludes')->nullable();
            $table->json('itinerary')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
