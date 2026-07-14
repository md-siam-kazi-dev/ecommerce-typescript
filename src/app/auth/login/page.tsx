"use client";

import { useState} from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { GoogleIcon } from "@/components/google-icon";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const DEMO_EMAIL = "demo@demo.com";
  const DEMO_PASSWORD = "siamSiam1@";

  const anyLoading = emailLoading || googleLoading || demoLoading;

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emailLoading || googleLoading) return;
    setEmailLoading(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        toast.error(error.message ?? "Unable to sign in. Please try again.");
        return;
      }
      toast.success("Welcome back! You're signed in.");
      router.push("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  }

  function handleGoogle() {
    if (emailLoading || googleLoading) return;
    setGoogleLoading(true);
    authClient.signIn.social({ provider: "google", callbackURL: "/" });
  }

  async function handleDemoLogin() {
    if (anyLoading) return;
    setDemoLoading(true);
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    try {
      const { error } = await authClient.signIn.email({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      if (error) {
        toast.error(error.message ?? "Demo login failed. Please try again.");
        return;
      }
      toast.success("Signed in with the demo account.");
      router.push("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 font-sans antialiased">
      

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              Sign in to your account to continue.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleEmailSubmit} className="flex gap-10 flex-col">
            <CardContent className="flex flex-col gap-5">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg font-medium"
                onClick={handleGoogle}
                disabled={googleLoading || emailLoading}
              >
                {googleLoading ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <GoogleIcon data-icon="inline-start" className="size-4" />
                )}
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg font-medium"
                onClick={handleDemoLogin}
                disabled={anyLoading}
              >
                {demoLoading ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Sparkles data-icon="inline-start" className="size-4" />
                )}
                Continue with demo account
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-primary transition-colors hover:text-foreground"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 px-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((open) => !open)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 bg-card pt-2">
              <Button
                type="submit"
                className="h-10 w-full rounded-lg font-medium"
                disabled={emailLoading || googleLoading}
              >
                {emailLoading && <Spinner data-icon="inline-start" />}
                Sign in
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary transition-colors hover:text-foreground"
                >
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </main>
  );
}
