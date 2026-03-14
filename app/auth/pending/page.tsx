'use client';
// app/auth/pending/page.tsx

import Link from 'next/link';
import { GraduationCap, Mail, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-navy-950 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gold-500 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-navy-950" />
            </div>
            <span className="font-serif font-bold text-white text-lg">
              ALUMNI
            </span>
          </Link>

          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-14">
        {/* Status card */}
        <div className="card p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
            <Clock className="h-10 w-10 text-amber-500" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-navy-900 mb-3">
            You&apos;re on the List!
          </h1>

          <p className="text-gray-600 leading-relaxed mb-6 max-w-md mx-auto">
            Your account has been submitted and is currently awaiting
            approval from our admin team. This process typically takes
            <span className="font-semibold text-navy-800">
              {" "}1–3 business days
            </span>.
          </p>

          {/* Steps */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {[
              { icon: CheckCircle, label: 'Account Created', done: true },
              { icon: Clock, label: 'Admin Review', done: false },
              { icon: Mail, label: 'Email Notification', done: false },
            ].map(({ icon: Icon, label, done }, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    done
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </div>

                {i < 2 && (
                  <span className="hidden sm:block text-gray-300 text-lg">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 text-left">
            <p className="font-semibold mb-1">📧 What happens next?</p>

            <p className="leading-relaxed">
              Once your account is approved, you&apos;ll receive a confirmation
              email. Then simply return to{" "}
              <Link
                href="/auth/login"
                className="underline font-medium"
              >
                the login page
              </Link>{" "}
              and sign in with your credentials.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Questions? Contact us at{" "}
          <a
            href="mailto:alumni@university.edu"
            className="text-gold-600 hover:underline"
          >
            alumni@university.edu
          </a>
        </p>
      </div>
    </div>
  );
}