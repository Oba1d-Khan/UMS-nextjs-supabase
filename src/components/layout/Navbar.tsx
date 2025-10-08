"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();

  const handleSignout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Signout failed:", error.message);
      alert("Failed to sign out, please try again.");
      return;
    }
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center w-[80vw] px-10 mx-auto bg-slate-50 rounded-full py-4 my-5 font-semibold">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/account">Account</Link>
      </div>
      <button onClick={handleSignout} className="cursor-pointer">
        Signout
      </button>
    </nav>
  );
}
