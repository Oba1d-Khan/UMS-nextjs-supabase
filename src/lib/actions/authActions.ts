"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient as createServerClient } from "@/utils/supabase/server";

export async function loginAction(formData: FormData) {
  const supabase = await createServerClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Supabase login error:", error.message);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
  return { success: "Login successful!" };
}

export async function signupAction(formData: FormData) {
  const supabaseServer = await createServerClient();

  const signUpPayload = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: formData.get("phone") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
        designation: formData.get("designation") as string,
        phone: formData.get("phone") as string,
      },
    },
  };

  console.log("signUpPayload", signUpPayload);

  const { data, error } = await supabaseServer.auth.signUp(signUpPayload);

  console.log("data-signUp", data);

  if (error) {
    console.error("Supabase Signup error:", error.message);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/check-email");
  return { success: "Signup successful!" };
}
