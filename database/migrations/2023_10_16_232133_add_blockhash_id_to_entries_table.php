<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBlockhashIdToEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('entries', function (Blueprint $table) {
            $table->unsignedBigInteger('blockhash_id')->nullable()->after('id'); // Add the new column
            $table->foreign('blockhash_id')->references('id')->on('block_hashes')->onDelete('set null'); // Set up the foreign key constraint
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('entries', function (Blueprint $table) {
            $table->dropForeign(['blockhash_id']); // Drop the foreign key constraint
            $table->dropColumn('blockhash_id'); // Drop the column
        });
    }
}
