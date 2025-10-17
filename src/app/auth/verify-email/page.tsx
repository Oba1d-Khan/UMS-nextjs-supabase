import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pt-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-base">
              We've sent a confirmation link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 pt-4">
              <Button asChild className="w-full h-11 text-base font-medium">
                <Link href="/login">
                  Back to Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-primary hover:underline transition-colors"
                >
                  Try again
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
