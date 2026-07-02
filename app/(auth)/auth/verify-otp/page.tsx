"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/config";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/students/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const message = await res.text();

      if (!res.ok) {
        throw new Error(message || "Verification failed");
      }

      router.push("/auth/verification-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/students/resend-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const message = await res.text();

    if (!res.ok) {
      throw new Error(message);
    }

    alert("A new OTP has been sent to your email.");
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : "Failed to resend OTP.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Verify Email
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Enter the OTP sent to
          <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-5">

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter OTP"
            className="w-full border rounded-lg p-3 text-center text-2xl tracking-[10px]"
          />

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-800 text-white rounded-lg py-3"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <button
          onClick={handleResendOtp}
          className="mt-4 text-blue-600 hover:underline w-full"
        >
          Resend OTP
        </button>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-gray-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}