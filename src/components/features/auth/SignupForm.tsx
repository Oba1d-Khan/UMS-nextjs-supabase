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
import { Loader2, UserPlus, Eye, EyeOff, Mail, Phone } from "lucide-react";

export default function SignupForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("email");

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
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append("signup_method", signupMethod);

    startTransition(async () => {
      const res = await signupAction(formData);
      if (res?.error) setMessage(res.error);
      if (res?.success) setMessage(res.success);
    });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 14) {
      form.setValue("phone", value);
      localStorage.setItem("pending_phone_signup", value);
    }
  };

  const toggleSignupMethod = () => {
    const newMethod = signupMethod === "email" ? "phone" : "email";
    setSignupMethod(newMethod);
    form.resetField("email");
    form.resetField("phone");
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pt-4">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>
          Choose how you'd like to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Signup Method Toggle */}
        <div className="flex justify-center">
          <div className="bg-muted p-1.5 rounded-lg flex">
            <Button
              type="button"
              variant={signupMethod === "email" ? "default" : "ghost"}
              size="sm"
              onClick={toggleSignupMethod}
              className={`flex items-center gap-2 ${
                signupMethod === "email" ? "shadow-sm" : ""
              }`}
              disabled={isPending}
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              type="button"
              variant={signupMethod === "phone" ? "default" : "ghost"}
              size="sm"
              onClick={toggleSignupMethod}
              className={`flex items-center gap-2 ${
                signupMethod === "phone" ? "shadow-sm" : ""
              }`}
              disabled={isPending}
            >
              <Phone className="h-4 w-4" />
              Phone
            </Button>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                {...form.register("full_name")}
                id="full_name"
                placeholder="Enter your full name"
                disabled={isPending}
                className="h-11 mt-1"
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.full_name.message}
                </p>
              )}
            </div>

            {/* Designation */}
            <div className="space-y-3">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                {...form.register("designation")}
                id="designation"
                placeholder="Enter your designation"
                disabled={isPending}
                className="h-11 mt-1"
              />
              {form.formState.errors.designation && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.designation.message}
                </p>
              )}
            </div>

            {/* Auth Field */}
            {signupMethod === "email" ? (
              <>
                {/* Email */}
                <div className="space-y-3">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    {...form.register("email")}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    disabled={isPending}
                    className="h-11 mt-1"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Contact No. (required bio field) */}
                <div className="space-y-3">
                  <Label htmlFor="phone">Contact No. *</Label>
                  <Input
                    {...form.register("phone", {
                      required: "Contact number is required",
                    })}
                    id="phone"
                    type="tel"
                    placeholder="Enter your contact number"
                    onChange={handlePhoneInput}
                    disabled={isPending}
                    maxLength={14}
                    className="h-11 mt-1"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              /* Phone Signup */
              <div className="space-y-3">
                <Label htmlFor="phone">Phone No. *</Label>
                <Input
                  {...form.register("phone", {
                    required: "Phone number is required",
                  })}
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  onChange={handlePhoneInput}
                  disabled={isPending}
                  maxLength={14}
                  className="h-11 mt-1"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="space-y-3">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  {...form.register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pr-10 h-11 mt-1"
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
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={isPending}>
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
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
