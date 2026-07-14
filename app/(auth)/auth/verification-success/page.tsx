"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function VerificationSuccessPage() {
  useEffect(() => {
    localStorage.removeItem("pendingUserData");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md w-full">

        <CheckCircle
          className="mx-auto text-green-600 mb-4"
          size={70}
        />

        <h1 className="text-3xl font-bold mb-3">
          Email Verified
        </h1>

        <p className="text-gray-600 mb-8">
          Your account has been verified successfully.
          <br />
          You can now log in.
        </p>

        <Link
          href="/auth/login"
          className="inline-block bg-navy-800 text-white px-8 py-3 rounded-lg"
        >
          Go to Login
        </Link>

      </div>

    </div>
  );
}