"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function insertUser(userData: {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
}) {
  const supabase = await createClient();

  console.log("userData to insert:", userData);

  const { data, error } = await supabase
    .from("user_profiles")
    .insert([userData]);
  // .select();

  console.log("Data inserted:", data);

  if (error) {
    console.error("Failed to add new user:", error.message);
    return { error: error.message };
  }

  revalidatePath("/user-management");
  return { success: "User created successfully!", data };
}
