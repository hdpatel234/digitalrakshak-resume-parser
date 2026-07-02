"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    // Mock the verification process that would happen on component mount
    // In a real app, you would extract a token from URL search params and verify it
    const verifyToken = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Mock success
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verifyToken();
  }, []);

  return (
    <Card className="border-border/60 shadow-lg shadow-black/5 text-center">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Email Verification</CardTitle>
        <CardDescription>
          {status === "verifying" && "Please wait while we verify your email address..."}
          {status === "success" && "Your email has been successfully verified."}
          {status === "error" && "The verification link is invalid or has expired."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-4">
        {status === "verifying" && (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        
        {status === "success" && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <Button className="w-full h-11" render={<Link href="/dashboard" />}>
              Continue to Dashboard
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <Button className="w-full h-11" variant="outline" render={<Link href="/login" />}>
              Return to Login
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
