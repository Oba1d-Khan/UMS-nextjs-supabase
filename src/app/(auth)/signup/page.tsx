import SignupForm from "@/components/features/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-card rounded-2xl shadow">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Create Account
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
