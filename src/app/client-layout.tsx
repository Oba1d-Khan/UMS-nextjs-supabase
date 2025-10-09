"use client";

import { SessionProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <Toaster />
        <Navbar />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
