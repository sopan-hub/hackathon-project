
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

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchUserProfile } = useUserProgress();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          avatar_url: `https://picsum.photos/seed/${email}/40/40`
        },
      },
    });
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message,
      });
      setLoading(false);
      return;
    } 
    
    if (data.user) {
        // The user object is available, but the session might not be active until email confirmation.
        // The onAuthStateChange listener in the context will handle fetching the profile once the user is logged in.

        // Also insert into public.profiles. This is now handled by a trigger in Supabase usually.
        // If not, it should be done in a server-side function for security.
        // For this client-side example, we'll proceed but be aware of RLS policies.
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({ id: data.user.id, full_name: name, eco_points: 0, avatar_url: `https://picsum.photos/seed/${email}/40/40` });

        if (profileError) {
             toast({
                variant: 'destructive',
                title: 'Could not save profile',
                description: profileError.message,
            });
        } else {
             toast({
                title: 'Account Created!',
                description: 'Please check your email to verify your account and then log in.',
            });
            // Don't auto-login, redirect to login page after signup success.
            router.push('/login');
        }
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="eco-card">
        <div className="eco-card-title">Create Account</div>
        <div className="eco-card-icon">
          <Icons.user className="bg-gradient-to-r from-green-400 to-blue-500" />
        </div>
        <div className="eco-card-content space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </div>
         <div className="eco-card-bar" />
        <div className="eco-card-footer justify-center">
            <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                Log in
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
