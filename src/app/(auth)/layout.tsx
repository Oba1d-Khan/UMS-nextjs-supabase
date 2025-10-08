import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Pages",
  description: "Signup and Login pages layout",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex items-center justify-center">
      <div className="w-full max-w-md bg-white/90  p-6 rounded-lg shadow-md">
        <h1 className="text-center text-2xl font-semibold mb-4 ">
          Auth Layout
        </h1>
        {children}
      </div>
    </div>
  );
}
