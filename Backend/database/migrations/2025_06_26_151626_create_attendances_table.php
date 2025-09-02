<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('attendance_tokens')) {
            Schema::create('attendance_tokens', function (Blueprint $table) {
                $table->id();
                $table->foreignId('event_id')
                    ->constrained()
                    ->onDelete('cascade');
                $table->string('token')->unique();
                $table->string('sms_code', 6)->nullable(); // max 6 characters
                $table->timestamp('starts_at');
                $table->timestamp('expires_at');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('attendance')) {
            Schema::create('attendance', function (Blueprint $table) {
                $table->id();
                $table->string('student_id'); // no longer a foreignId
                $table->foreign('student_id')
                    ->references('student_id')
                    ->on('students')
                    ->onDelete('cascade');

                $table->foreignId('event_id')
                    ->constrained()
                    ->onDelete('cascade');

                $table->string('method');
                $table->timestamp('marked_at')->useCurrent();
                $table->boolean('is_registered')->default(true);
                $table->timestamps();

                $table->unique(['student_id', 'event_id']);
            });

        }
    }

};
