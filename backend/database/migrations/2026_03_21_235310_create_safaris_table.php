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
        Schema::create('safaris', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->string('category')->default('Wildlife Safari');
            $table->string('duration')->nullable();
            $table->integer('days')->default(1);
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('highlights')->nullable();
            $table->json('included')->nullable();
            $table->json('excluded')->nullable();
            $table->string('difficulty')->nullable();
            $table->integer('min_guests')->default(1);
            $table->integer('max_guests')->default(10);
            $table->foreignId('destination_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('featured')->default(false);
            $table->boolean('active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('safaris');
    }
};
