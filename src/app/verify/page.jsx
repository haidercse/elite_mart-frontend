"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [verifyBy, setVerifyBy] = useState("email");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const id = searchParams.get("user_id");
    const method = searchParams.get("verify_by") || "email";
    
    if (!id) {
      setError("Invalid verification link. Please register again.");
      return;
    }
    
    setUserId(id);
    setVerifyBy(method);
  }, [searchParams]);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/proxy/v2/auth/confirm_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          verification_code: code,
        }),
      });

      const data = await response.json();

      if (!data.result && !data.success) {
        throw new Error(data.message || "Verification failed.");
      }

      setSuccess("Account verified successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setResendMessage("");
    setError("");

    try {
      const response = await fetch("/api/proxy/v2/auth/resend_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          verify_by: verifyBy,
        }),
      });

      const data = await response.json();

      if (data.result || data.success) {
        setResendMessage(`Code sent to your ${verifyBy}. Check your ${verifyBy === "email" ? "email" : "phone"}.`);
      } else {
        throw new Error(data.message || "Failed to resend code.");
      }
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-purple-800 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Verify Account</h1>
          <p className="text-sm text-gray-500 mb-8">
            We've sent a verification code to your {verifyBy}. Enter it below to verify your account.
          </p>

          <form onSubmit={handleVerifyCode} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Verification Code</span>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(val);
                  setError("");
                }}
                maxLength="6"
                placeholder="000000"
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-center text-2xl tracking-widest focus:border-purple-500 focus:ring-purple-500 outline-none font-mono"
              />
              <p className="text-xs text-gray-400 mt-2 text-center">{code.length}/6 digits</p>
            </label>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
                {success}
              </div>
            )}
            {resendMessage && (
              <div className="rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 text-sm">
                {resendMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full py-3 rounded-2xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors disabled:opacity-60"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full py-3 rounded-2xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors disabled:opacity-60"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link href="/login" className="text-purple-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>

          <p className="mt-2 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-700 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
