// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alumni Network | University Alumni Relations',
  description: 'The official platform for university alumni to network, mentor, and find career opportunities.',
  keywords: 'alumni, university, networking, mentorship, careers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
