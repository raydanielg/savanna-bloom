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
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('country')->nullable();
            $table->string('subject')->nullable();
            $table->string('inquiry_type')->default('general');
            $table->string('bookable_type')->nullable();
            $table->unsignedBigInteger('bookable_id')->nullable();
            $table->text('message');
            $table->date('preferred_date')->nullable();
            $table->integer('guests')->nullable();
            $table->string('status')->default('new');
            $table->string('accommodation')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->foreignId('replied_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index(['bookable_type', 'bookable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
