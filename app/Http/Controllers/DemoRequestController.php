<?php

namespace App\Http\Controllers;

use App\Mail\DemoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class DemoRequestController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'institution' => 'required|string|max:255',
            'focus' => 'array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            Mail::send(new DemoRequest($request->all()));
            return response()->json(['message' => 'Demo request submitted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send demo request'], 500);
        }
    }
}
