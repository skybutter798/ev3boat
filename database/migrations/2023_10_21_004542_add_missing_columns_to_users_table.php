<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->integer('points')->default(0);
        $table->integer('clicks')->default(0);
        $table->integer('golds')->default(0);
    });
}


    public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('points');
        $table->dropColumn('clicks');
        $table->dropColumn('golds');
    });
}

};
