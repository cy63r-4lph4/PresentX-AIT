<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('semesters', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->date('start_date');
        $table->date('end_date');
        $table->enum('status', ['upcoming', 'current', 'past'])->default('upcoming');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semesters');
    }
};
