<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            // Timestamp for when the like happened; defaults to current time
            if (!Schema::hasColumn('likes', 'LIKED_AT')) {
                $table->timestamp('LIKED_AT')->useCurrent()->after('OWNER_ID');
            }
        });
    }

    public function down(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            if (Schema::hasColumn('likes', 'LIKED_AT')) {
                $table->dropColumn('LIKED_AT');
            }
        });
    }
};
