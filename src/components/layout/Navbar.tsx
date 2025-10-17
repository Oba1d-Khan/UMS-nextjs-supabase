"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, User, Settings, LogOut } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Avoid hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === "SIGNED_OUT") {
        toast.info("Logged out!");
      }
    });

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

  const handleThemeToggle = () => {
    const currentTheme = resolvedTheme || theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!session?.user) return "U";
    const fullName = session.user.user_metadata?.full_name || "";
    return fullName
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
          {/* Navigation Links */}
          {session ? (
            <>
              <Link
                href="/"
                className="hover:text-primary transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-primary transition-colors duration-200"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
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

          <div className="border-l border-border h-6"></div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="rounded-full hover:bg-accent hover:text-accent-foreground"
          >
            {displayTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* User Avatar Dropdown */}
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.user_metadata?.avatar_url}
                      alt={session.user.user_metadata?.full_name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Manage Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </nav>
  );
}
