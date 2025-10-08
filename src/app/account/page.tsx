import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user", user);
  if (!user) {
    redirect("/login");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("session", session);

  return (
    <div className="flex items-center justify-center py-10">
      Welcome! {user.email}
      {session?.user?.user_metadata?.email_verified === true && (
        <span className="text-green-600 p-2 bg-green-200 rounded-lg mx-4 text-xs">
          Verified
        </span>
      )}
    </div>
  );
}
