
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

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          avatar_url: `https://api.dicebear.com/8.x/bottts/svg?seed=${email}`,
          email: email
        }
      }
    });
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message,
      });
      setLoading(false);
    } else if (data.user) {
      // The onAuthStateChange listener in the context will handle profile creation.
      toast({
        title: 'Account Created!',
        description: 'Welcome to EcoChallenge!',
      });
      router.push('/');
    } else {
        // This case might happen if email confirmation is still enabled in Supabase
         toast({
            variant: 'destructive',
            title: 'Please check your Supabase settings',
            description: 'Email confirmation might still be enabled in your Supabase project. Please disable it to log in directly.',
        });
        setLoading(false);
    }
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
