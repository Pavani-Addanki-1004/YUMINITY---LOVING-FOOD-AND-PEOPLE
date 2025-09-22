<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            // Ensure InnoDB so foreign-keys are supported if added later
            $table->engine = 'InnoDB';
            $table->increments('COMMENT_ID');
            $table->integer('OWNER_ID')->unsigned()->index();
            $table->integer('DISH_ID')->unsigned()->index();
            $table->longText('COMMENT_TEXT');
            $table->dateTime('COMMENT_DATETIME')->useCurrent();

            // NOTE: Skipping FKs here to avoid errno:150 on environments with existing
            // tables or mismatched collations/engines. Logical relations are preserved
            // and can be enforced at application level.
            // $table->foreign('OWNER_ID')->references('ID')->on('users')->onDelete('cascade')->onUpdate('cascade');
            // $table->foreign('DISH_ID')->references('DISH_ID')->on('dishes')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
