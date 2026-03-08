// app/not-found.tsx
import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-gold-500 p-3 rounded-2xl mb-6">
        <GraduationCap className="h-10 w-10 text-navy-950" />
      </div>
      <h1 className="font-serif text-8xl font-bold text-white mb-4">404</h1>
      <h2 className="font-serif text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        The page you're looking for doesn't exist or you may not have access. Please check the URL or return home.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-gold flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Return Home
        </Link>
        <Link href="/alumni" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-colors">
          Browse Alumni
        </Link>
      </div>
    </div>
  );
}
