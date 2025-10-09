import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UMS - Authentication",
  description: "Secure authentication for User Management System",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 px-4 py-8">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl p-8">
        <div className="mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            UMS Auth
          </h1>
          <p className="text-muted-foreground text-sm">
            User Management System
          </p>
        </div>
        <Separator />
        {children}
      </div>
    </div>
  );
}
