
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer needed as authentication has been removed.
// Redirecting to the home page.
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return null;
}
