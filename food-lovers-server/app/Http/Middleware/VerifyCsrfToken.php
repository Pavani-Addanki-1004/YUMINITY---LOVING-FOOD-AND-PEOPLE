<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        // Exempt API-style routes called from the static frontend (no CSRF token)
        'createUser',
        'login',
        'updateUser',
        'postDish',
        'updateDish',
        'getSelfPostedDishes',
        'getRecentPostedDishes',
        'getDish',
        'searchDishes',
        'postDishComment',
        'countLikes',
        'countUserLikes',
        'likeDish',
        'unlikeDish',
        'countTotalLikesUser',
        'getUser',
        'getUserFromId',
        // New richer browsing endpoints
        'getTrendingDishes',
        'getRandomDish',
        'getForYouDishes',
        'getDishesByCuisine',
    ];
}
