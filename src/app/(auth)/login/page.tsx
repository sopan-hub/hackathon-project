'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { supabase } from '@/lib/supabase';
import { useUserProgress } from '@/context/user-progress-context';
import type { User } from '@supabase/supabase-js';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchUserProfile } = useUserProgress();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } else if (data.user) {
      await fetchUserProfile(data.user as User);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="eco-card">
        <div className="eco-card-title">Welcome Back</div>
        <div className="eco-card-icon">
          <Icons.logIn className="bg-gradient-to-r from-green-400 to-blue-500" />
        </div>
        <div className="eco-card-content space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </div>
        <div className="eco-card-bar" />
        <div className="eco-card-footer justify-center">
            <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
