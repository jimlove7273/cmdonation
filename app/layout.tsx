import type React from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/contexts/AuthContext';
import { InactivityModal } from '@/components/inactivity-modal';
import './globals.css';

const _roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Clay Music Donations',
  description: 'Clay Music Donations',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <InactivityModal />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
