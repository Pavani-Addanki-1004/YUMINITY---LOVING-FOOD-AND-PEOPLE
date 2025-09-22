<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dishes', function (Blueprint $table) {
            $table->increments('DISH_ID');
            $table->string('DISH_NAME');
            $table->string('CUISINE_TYPE', 100);
            $table->text('DISH_IMG_URL');
            $table->longText('DISH_INGREDIENTS');
            $table->longText('DISH_DIRECTIONS');
            $table->text('DISH_VIDEO_URL')->nullable();
            $table->integer('OWNER_ID')->unsigned();
            $table->string('PREP_TIME', 100);
            $table->dateTime('DISH_POSTED_AT')->useCurrent();

            $table->foreign('OWNER_ID')->references('ID')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dishes');
    }
};
