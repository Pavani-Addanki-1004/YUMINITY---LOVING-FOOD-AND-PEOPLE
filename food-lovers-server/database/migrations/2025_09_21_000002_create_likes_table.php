<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('LIKE_ID');
            $table->integer('DISH_ID')->unsigned()->index();
            $table->integer('OWNER_ID')->unsigned()->index();
            $table->unique(['DISH_ID', 'OWNER_ID']);

            // FKs disabled to avoid errno:150 on existing environments/collation mismatches
            // $table->foreign('DISH_ID')->references('DISH_ID')->on('dishes')->onDelete('cascade')->onUpdate('cascade');
            // $table->foreign('OWNER_ID')->references('ID')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
