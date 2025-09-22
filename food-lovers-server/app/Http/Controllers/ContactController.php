<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'note' => $request->note,
        ];

        Mail::send('contact', ['data' => $data], function ($message) use ($data) {
            $message->to('pavanitejaaddanki@gmail.com')
                    ->subject('Message from Customer')
                    ->replyTo($data['email']);
        });

        return back()->with('success', 'Your message has been sent!');
    }
}
