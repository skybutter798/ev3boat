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
    Schema::create('codes', function (Blueprint $table) {
        $table->id();
        $table->string('code');
        $table->string('type');
        $table->boolean('status')->default(true);
        $table->timestamps();
    });

    Schema::create('code_user', function (Blueprint $table) {
        $table->id();
        $table->foreignId('code_id')->constrained();
        $table->foreignId('user_id')->constrained();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('codes');
    }
};