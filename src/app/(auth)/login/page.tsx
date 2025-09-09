
'use client';

import { useState } from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Simulate API call for login
    setTimeout(() => {
      setLoading(false);
      // In a real app, you'd verify credentials. Here, we'll just log the user in.
      // We'll use a generic name since we don't know who is logging in.
      setUser({
        firstName: "Welcome",
        lastName: "Back",
        email: email,
        isLoggedIn: true,
      });
      toast({
        title: "Login Successful!",
        description: "Welcome back to EcoChallenge.",
      });
      router.push('/'); // Redirect to dashboard after login
    }, 1000);
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Icons.leaf className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center font-headline">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
             <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
