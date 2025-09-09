
import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from '@/context/user-context';

export const metadata: Metadata = {
  title: 'EcoChallenge',
  description: 'Learn, Act, and Inspire for a Greener Planet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <UserProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
