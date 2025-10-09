"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import type { Session } from "@supabase/supabase-js"; // It's good practice to import the type

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  // 1. Store the full session object instead of just a boolean
  const [session, setSession] = useState<Session | null>(null);

  // Avoid hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Simplified auth listener
  useEffect(() => {
    // Listener fires immediately with the initial session, so no need for a separate getSession()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === "SIGNED_OUT") {
        toast.info("Logged out!");
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out, please try again.");
      return;
    }
    router.push("/login");
  };

  // Theme toggle logic remains the same
  const handleThemeToggle = () => {
    const currentTheme = resolvedTheme || theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const displayTheme = mounted ? resolvedTheme || theme : "light";

  return (
    <nav className="flex justify-between items-center w-[80vw] px-10 mx-auto bg-card border rounded-full py-4 my-5 font-semibold text-card-foreground shadow-sm">
      <Link href="/" className="text-3xl font-bold text-foreground">
        UMS.
      </Link>

      {/* Render content only after mounting to avoid hydration issues */}
      {mounted && (
        <div className="flex gap-6 items-center text-foreground">
          {/* Use the session object for conditional rendering */}
          {session ? (
            <>
              {/* Logged-in links */}
              <Link
                href="/"
                className="hover:text-primary transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/account"
                className="hover:text-primary transition-colors duration-200"
              >
                Account
              </Link>
              <Button
                variant="ghost"
                onClick={handleSignout}
                className="hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
              >
                Signout
              </Button>
            </>
          ) : (
            <>
              {/* Logged-out links */}
              <Link
                href="/login"
                className="hover:text-primary transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hover:text-primary transition-colors duration-200"
              >
                Signup
              </Link>
            </>
          )}

          {/* 3. Moved duplicated elements outside the conditional */}
          <div className="border-l border-border h-6"></div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="rounded-full hover:bg-accent hover:text-accent-foreground"
          >
            {displayTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      )}
    </nav>
  );
}
