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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location')->nullable();
            $table->string('country')->nullable();
            $table->string('avatar')->nullable();
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->text('text');
            $table->string('bookable_type')->nullable();
            $table->unsignedBigInteger('bookable_id')->nullable();
            $table->foreignId('booking_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('featured')->default(false);
            $table->boolean('approved')->default(false);
            $table->timestamps();
            
            $table->index(['bookable_type', 'bookable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
