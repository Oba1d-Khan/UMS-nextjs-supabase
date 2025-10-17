"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/actions/authActions";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, Eye, EyeOff, Phone, Mail } from "lucide-react";
import { loginSchema, LoginSchema } from "@/lib/validations/authSchema";

export default function LoginForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginSchema) => {
    setMessage(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );
    formData.append("login_method", loginMethod);

    // Save login method to localStorage for OTP verification
    localStorage.setItem("login_method", loginMethod);

    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) setMessage(res.error);
      if (res?.success) setMessage(res.success);
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle phone input and save to localStorage
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 14) {
      form.setValue("phone", value);
      localStorage.setItem("pending_phone_login", value);
    }
  };

  const switchToPhoneLogin = () => {
    setLoginMethod("phone");
    form.reset();
    // Clear any existing phone data when switching to phone login
    localStorage.removeItem("pending_phone");
  };

  const switchToEmailLogin = () => {
    setLoginMethod("email");
    form.reset();
    // Clear phone data when switching back to email
    localStorage.removeItem("pending_phone");
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pt-4">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account {loginMethod === "phone" && "with phone"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phone Login Button - Only show when in email mode */}
        {loginMethod === "email" && (
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 mx-2"
            onClick={switchToPhoneLogin}
            disabled={isPending}
          >
            <Phone className="mr-2 h-4 w-4" />
            Login with Phone
          </Button>
        )}
        {/* Back to Email Login - Only show when in phone mode */}
        {loginMethod === "phone" && (
          <Button
            type="button"
            variant="outline"
            className="w-full h-11  "
            onClick={switchToEmailLogin}
            disabled={isPending}
          >
            <Mail className="mr-2 h-4 w-4" />
            Login with Email
          </Button>
        )}
        {/* Divider when in email mode */}
        {loginMethod === "email" && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex my-2 justify-center text-xs uppercase">
              <span className=" px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        )}
        {/* Divider for phone mode  */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex my-2 justify-center text-xs uppercase">
            {/* <span className=" px-2 text-muted-foreground">
              Or continue with email
            </span> */}
          </div>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            {/* Email/Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor={loginMethod === "email" ? "email" : "phone"}
                className="text-sm font-medium"
              >
                {loginMethod === "email" ? "Email" : "Phone Number"}
              </Label>
              <Input
                {...form.register(loginMethod === "email" ? "email" : "phone")}
                id={loginMethod === "email" ? "email" : "phone"}
                type={loginMethod === "email" ? "email" : "tel"}
                placeholder={
                  loginMethod === "email"
                    ? "Enter your email"
                    : "Enter your phone number"
                }
                className="h-11"
                disabled={isPending}
                maxLength={loginMethod === "phone" ? 14 : undefined}
                onChange={
                  loginMethod === "phone" ? handlePhoneInput : undefined
                }
              />
              {form.formState.errors.email && loginMethod === "email" && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.email.message}
                </p>
              )}
              {form.formState.errors.phone && loginMethod === "phone" && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  {...form.register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                Signing In...
              </>
            ) : (
              <> Sign In</>
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
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
