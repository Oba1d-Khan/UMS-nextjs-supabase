"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyOTP } from "@/lib/actions/authActions";
import { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FormSchema = z.object({
  pin: z
    .string()
    .min(6, { message: "Your one-time password must be 6 digits." }),
});

export default function OtpVerificationPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine if this is for login or signup
  const verificationType = searchParams.get("type") || "signup";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    // Get phone number based on verification type
    let phone = "";
    if (verificationType === "login") {
      phone = localStorage.getItem("pending_phone_login") || "";
    } else {
      phone = localStorage.getItem("pending_phone_signup") || "";
    }

    formData.append("phone", phone);
    formData.append("verification_type", verificationType);

    startTransition(async () => {
      const result = await verifyOTP(formData);

      if (result?.error) {
        toast.error("Verification Failed", {
          description: result.error,
        });
      } else {
        toast.success("OTP verified successfully", {
          description: `Entered code: ${values.pin}`,
        });

        // Clean up localStorage based on verification type
        if (verificationType === "login") {
          localStorage.removeItem("pending_phone_login");
        } else {
          localStorage.removeItem("pending_phone_signup");
        }

        // Redirect based on verification type
        if (verificationType === "login") {
          router.push("/dashboard");
        } else {
          router.push("/onboarding"); // or wherever you want signup users to go
        }
      }
    });
  }

  // Get the appropriate phone number for display
  const getPhoneForDisplay = () => {
    if (verificationType === "login") {
      return localStorage.getItem("pending_phone_login") || "";
    } else {
      return localStorage.getItem("pending_phone_signup") || "";
    }
  };

  // Get back link based on verification type
  const getBackLink = () => {
    return verificationType === "login" ? "/login" : "/signup";
  };

  // Get page title and description based on verification type
  const pageTitle =
    verificationType === "login" ? "Verify Your Login" : "Verify Your Phone";

  const description =
    verificationType === "login"
      ? "Enter the 6-digit code sent to your phone to sign in"
      : "Enter the 6-digit code to verify your phone number";

  const phoneNumber = getPhoneForDisplay();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md relative">
        {/* Back Button - top left */}
        <Link
          href={getBackLink()}
          className="absolute top-4 left-4 flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {verificationType === "login" ? "Sign In" : "Sign Up"}
        </Link>

        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pt-10">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
            {phoneNumber && (
              <p className="text-sm text-muted-foreground mt-2">
                Code sent to: {phoneNumber}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-center space-y-6"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col items-center">
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      {/* <FormDescription>
                        Please enter the 6-digit verification code.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                  disabled={isPending}
                >
                  {isPending ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Didn't receive the code?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-primary hover:underline"
                    onClick={() =>
                      toast.info("OTP Resent", {
                        description: "A new code has been sent to your phone.",
                      })
                    }
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
