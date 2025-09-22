use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;

Route::post('/createUser', function(Request $request) {
    $request->validate([
        'name' => 'required|string|min:6',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        // <-- DO NOT add 'created_at' or 'updated_at' here
    ]);

    return response()->json([
        'success' => true,
        'name' => $user->name,
        'email' => $user->email
    ]);
});
