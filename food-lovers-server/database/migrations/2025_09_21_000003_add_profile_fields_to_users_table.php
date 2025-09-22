<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Add missing profile-related columns if they don't exist
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'PROFILE_URL')) {
                $table->text('PROFILE_URL')->nullable();
            }
            if (!Schema::hasColumn('users', 'GENDER')) {
                $table->string('GENDER', 20)->nullable();
            }
            if (!Schema::hasColumn('users', 'LOCATION')) {
                $table->string('LOCATION')->nullable();
            }
            if (!Schema::hasColumn('users', 'CAPTION')) {
                $table->text('CAPTION')->nullable();
            }
            if (!Schema::hasColumn('users', 'CREATED_AT')) {
                $table->dateTime('CREATED_AT')->useCurrent();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'PROFILE_URL')) {
                $table->dropColumn('PROFILE_URL');
            }
            if (Schema::hasColumn('users', 'GENDER')) {
                $table->dropColumn('GENDER');
            }
            if (Schema::hasColumn('users', 'LOCATION')) {
                $table->dropColumn('LOCATION');
            }
            if (Schema::hasColumn('users', 'CAPTION')) {
                $table->dropColumn('CAPTION');
            }
            // keep CREATED_AT if present; many queries may rely on it
        });
    }
};
