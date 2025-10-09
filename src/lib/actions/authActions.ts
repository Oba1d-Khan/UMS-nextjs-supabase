"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

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
  const supabase = await createClient();

  const userData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signUp(userData);

  if (error) {
    console.error("Supabase Signup  error:", error.message);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/check-email");
  return { success: "Signup successful!" };
}
