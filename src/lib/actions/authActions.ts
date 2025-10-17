"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient as createServerClient } from "@/utils/supabase/server";

export async function loginAction(formData: FormData) {
  const supabase = await createServerClient();
  const loginMethod = formData.get("login_method") as "email" | "phone";
  const password = formData.get("password") as string;

  const credentials =
    loginMethod === "email"
      ? { email: formData.get("email") as string, password }
      : { phone: formData.get("phone") as string, password };

  console.log("Login attempt:", { loginMethod, credentials });

  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    console.error("Supabase login error:", error.message);
    return { error: error.message };
  }

  console.log("Login success data:", data);

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signupAction(formData: FormData) {
  const supabaseServer = await createServerClient();

  const signupMethod = formData.get("signup_method") as string;

  let signUpPayload;

  if (signupMethod === "phone") {
    signUpPayload = {
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      options: {
        data: {
          full_name: formData.get("full_name") as string,
          designation: formData.get("designation") as string,
          phone: formData.get("phone") as string,
        },
      },
    };
  } else {
    signUpPayload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: {
        data: {
          full_name: formData.get("full_name") as string,
          designation: formData.get("designation") as string,
          phone: formData.get("phone") as string,
        },
      },
    };
  }

  console.log("signUpPayload", signUpPayload);

  const { data, error } = await supabaseServer.auth.signUp(signUpPayload);

  console.log("data-signUp", data);

  if (error) {
    console.error("Supabase Signup error:", error.message);
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  if (signupMethod === "phone") {
    redirect("/auth/verify-otp?type=signup");
  } else {
    redirect("/auth/verify-email");
  }
  return { success: "Signup successful!" };
}

export async function verifyOTP(formData: FormData) {
  const supabaseServer = await createServerClient();
  const pin = formData.get("pin") as string;
  const phone = formData.get("phone") as string;

  console.log("formData", formData);
  console.log("pin", pin, "phone", phone);

  const { data, error } = await supabaseServer.auth.verifyOtp({
    token: pin,
    type: "sms",
    phone: phone,
  });

  if (error) console.error(error);
  // return data;

  revalidatePath("/", "layout");
  redirect("/");
  return { success: "OTP Verification Successful!" };
}
