"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [registering, setRegistering] = useState(false);
  const router = useRouter();


  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    router.push("/");
  }


  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="w-full max-w-sm">
        <div className="w-full">
          <div
            className="mb-4 gap-2 text-4xl font-semibold tracking-tight text-center"
          >
            TaskVIDIA
          </div>
          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-center">
              {registering ? "Create your account" : "Welcome back"}
            </h1>
          </div>
          <Card>
            <CardContent className="p-5">
              <form onSubmit={submit} className="space-y-4">
                {registering && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      required
                      placeholder="Maya Chen"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    minLength={8}
                    autoComplete={
                      registering ? "new-password" : "current-password"
                    }
                    required
                    placeholder="At least 8 characters"
                  />
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  {registering ? "Create account" : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            {registering ? "Already have an account?" : "New to TaskVDIA?"}
            <button
              type="button"
              className="ml-1 font-medium text-primary hover:underline"
              onClick={() => {
                setRegistering(!registering);
              }}
            >
              {registering ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
