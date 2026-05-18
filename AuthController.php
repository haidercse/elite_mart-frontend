<?php

/** @noinspection PhpUndefinedClassInspection */

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\OTPVerificationController;
use App\Models\BusinessSetting;
use App\Models\Customer;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use App\Notifications\AppEmailVerificationNotification;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function signup(Request $request)
    {
        // Check if user already exists based on registration method
        $existingUser = null;
        
        if ($request->register_by == 'email') {
            $existingUser = User::where('email', $request->email_or_phone)->first();
        } else {
            $existingUser = User::where('phone', $request->email_or_phone)->first();
        }
        
        if ($existingUser != null) {
            return response()->json([
                'result' => false,
                'message' => translate('User already exists.'),
                'user_id' => 0
            ], 201);
        }

        try {
            if ($request->register_by == 'email') {
                $user = new User([
                    'name' => $request->name,
                    'email' => $request->email_or_phone,
                    'password' => bcrypt($request->password),
                    'verification_code' => rand(100000, 999999)
                ]);
            } else {
                $user = new User([
                    'name' => $request->name,
                    'phone' => $request->email_or_phone,
                    'password' => bcrypt($request->password),
                    'verification_code' => rand(100000, 999999)
                ]);
            }

            if ($request->register_by == 'email') {
                $emailVerificationSetting = BusinessSetting::where('type', 'email_verification')->first();
                
                if ($emailVerificationSetting && $emailVerificationSetting->value != 1) {
                    $user->email_verified_at = date('Y-m-d H:i:s');
                } else {
                    try {
                        $user->notify(new AppEmailVerificationNotification());
                    } catch (\Exception $e) {
                        // Log error but continue
                        \Log::error('Email notification failed: ' . $e->getMessage());
                    }
                }
            } else {
                try {
                    $otpController = new OTPVerificationController();
                    $otpController->send_code($user);
                } catch (\Exception $e) {
                    // Log error but continue
                    \Log::error('OTP send failed: ' . $e->getMessage());
                }
            }

            // Save user
            if (!$user->save()) {
                return response()->json([
                    'result' => false,
                    'message' => translate('Failed to create user. Please try again.'),
                    'user_id' => 0
                ], 400);
            }

            // Create customer
            $customer = new Customer;
            $customer->user_id = $user->id;
            $customer->save();

            // Create token
            $user->createToken('tokens')->plainTextToken;

            return response()->json([
                'result' => true,
                'message' => translate('Registration Successful. Please verify and log in to your account.'),
                'user_id' => $user->id
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'result' => false,
                'message' => translate('Registration failed: ' . $e->getMessage()),
                'user_id' => 0
            ], 400);
        }
    }

    public function resendCode(Request $request)
    {
        $user = User::where('id', $request->user_id)->first();
        $user->verification_code = rand(100000, 999999);

        if ($request->verify_by == 'email') {
            $user->notify(new AppEmailVerificationNotification());
        } else {
            $otpController = new OTPVerificationController();
            $otpController->send_code($user);
        }

        $user->save();

        return response()->json([
            'result' => true,
            'message' => translate('Verification code is sent again'),
        ], 200);
    }

    public function confirmCode(Request $request)
    {
        $user = User::where('id', $request->user_id)->first();

        if ($user->verification_code == $request->verification_code) {
            $user->email_verified_at = date('Y-m-d H:i:s');
            $user->verification_code = null;
            $user->save();
            return response()->json([
                'result' => true,
                'message' => translate('Your account is now verified.Please login'),
            ], 200);
        } else {
            return response()->json([
                'result' => false,
                'message' => translate('Code does not match, you can request for resending the code'),
            ], 200);
        }
    }

    public function login(Request $request)
    {
        /*$request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean'
        ]);*/

        $delivery_boy_condition = $request->has('user_type') && $request->user_type == 'delivery_boy';

        if ($delivery_boy_condition) {
            $user = User::whereIn('user_type', ['delivery_boy'])
                        ->where(function($query) use ($request) {
                            $query->where('email', $request->email)
                                  ->orWhere('phone', $request->email);
                        })
                        ->first();
        } else {
            $user = User::whereIn('user_type', ['customer', 'seller'])
                        ->where(function($query) use ($request) {
                            $query->where('email', $request->email)
                                  ->orWhere('phone', $request->email);
                        })
                        ->first();
        }

        if (!$delivery_boy_condition) {
            if (\App\Utility\PayhereUtility::create_wallet_reference($request->identity_matrix) == false) {
                return response()->json(['result' => false, 'message' => 'Identity matrix error', 'user' => null], 401);
            }
        }

        if ($user != null) {
            if (Hash::check($request->password, $user->password)) {
                if ($user->email_verified_at == null) {
                    return response()->json(['result' => false, 'message' => translate('Please verify your account'), 'user' => null], 401);
                }
                return $this->loginSuccess($user);
            } else {
                return response()->json(['result' => false, 'message' => translate('Unauthorized'), 'user' => null], 401);
            }
        } else {
            return response()->json(['result' => false, 'message' => translate('User not found'), 'user' => null], 401);
        }
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'result' => true,
            'message' => translate('Successfully logged out')
        ]);
    }

    public function socialLogin(Request $request)
    {
        if (User::where('email', $request->email)->first() != null) {
            $user = User::where('email', $request->email)->first();
        } else {
            $user = new User([
                'name' => $request->name,
                'email' => $request->email,
                'provider_id' => $request->provider,
                'email_verified_at' => Carbon::now()
            ]);
            $user->save();
            $customer = new Customer;
            $customer->user_id = $user->id;
            $customer->save();
        }
        return $this->loginSuccess($user);
    }

    protected function loginSuccess($user)
    {
        $token = $user->createToken('API Token')->plainTextToken;
        return response()->json([
            'result' => true,
            'message' => translate('Successfully logged in'),
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_at' => null,
            'user' => [
                'id' => $user->id,
                'type' => $user->user_type,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'avatar_original' => api_asset($user->avatar_original),
                'phone' => $user->phone
            ]
        ]);
    }
}
