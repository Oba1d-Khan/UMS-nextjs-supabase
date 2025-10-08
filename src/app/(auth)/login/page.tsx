import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-card rounded-2xl shadow">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Welcome Back
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
