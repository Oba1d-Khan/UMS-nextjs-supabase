"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signupAction } from "@/lib/actions/authActions";
import { signupSchema, type SignupSchema } from "@/lib/validations/authSchema";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";

export default function SignupForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      designation: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = (values: SignupSchema) => {
    setMessage(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );

    startTransition(async () => {
      const res = await signupAction(formData);
      if (res?.error) setMessage(res.error);
      if (res?.success) setMessage(res.success);
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 14) {
      form.setValue("phone", value);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pt-4">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                {...form.register("full_name")}
                id="full_name"
                placeholder="Enter your full name"
                className="h-11"
                disabled={isPending}
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation" className="text-sm font-medium">
                Designation *
              </Label>
              <Input
                {...form.register("designation")}
                id="designation"
                placeholder="Enter your designation"
                className="h-11"
                disabled={isPending}
              />
              {form.formState.errors.designation && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.designation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                {...form.register("email")}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-11"
                disabled={isPending}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                {...form.register("phone")}
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className="h-11"
                disabled={isPending}
                onChange={handlePhoneInput}
                maxLength={14}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password *
              </Label>
              <div className="relative">
                <Input
                  {...form.register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="h-11 pr-10"
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </form>

        {message && (
          <Alert
            variant={message.includes("success") ? "default" : "destructive"}
          >
            <AlertDescription className="text-sm">{message}</AlertDescription>
          </Alert>
        )}

        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
