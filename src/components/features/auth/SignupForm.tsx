"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signupAction } from "@/lib/actions/authActions";
import { signupSchema, type SignupSchema } from "@/lib/validations/authSchema";

export default function SignupForm() {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupSchema) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );
    const res = await signupAction(formData);
    if (res?.error) setMessage(res.error);
    if (res?.success) setMessage(res.success);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto"
    >
      <div>
        <Label>Username</Label>
        <Input {...form.register("username")} />
        {form.formState.errors.username && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div>
        <Label>Email</Label>
        <Input {...form.register("email")} type="email" />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label>Password</Label>
        <Input {...form.register("password")} type="password" />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Sign Up
      </Button>

      {message && (
        <p
          className={`text-sm ${
            message.includes("successful") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
