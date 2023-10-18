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
        Schema::create('block_hashes', function (Blueprint $table) {
            $table->id();
            $table->string('hash'); // To store the block hash
            $table->string('link'); // To store the Etherscan link
            $table->timestamp('retrieved_at'); // To store the timestamp when the hash was retrieved
            $table->timestamps(); // Laravel's default created_at and updated_at timestamps
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('block_hashes');
    }
};
