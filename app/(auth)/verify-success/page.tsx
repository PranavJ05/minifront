'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function VerifySuccessPage() {

const router = useRouter();

useEffect(() => {
const timer = setTimeout(() => {
router.push('/auth/login'); // 🔁 redirect after 3 sec
}, 3000);

return () => clearTimeout(timer);

}, []);

return (
<div className="min-h-screen flex items-center justify-center bg-gray-50">

  <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">

    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />

    <h1 className="text-2xl font-bold text-navy-900 mb-2">
      Email Verified Successfully 🎉
    </h1>

    <p className="text-gray-600 mb-6">
      Your account is now active. You can login and start using the platform.
    </p>

    <p className="text-sm text-gray-400">
      Redirecting to login page...
    </p>

  </div>

</div>

);
}