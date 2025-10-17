import Dashboard from "@/components/features/dashboard/Dashboard";
import LandingPage from "@/components/features/landing/landing";
import { fetchUser } from "@/utils/fetchSupabase/fetchSupabaseData";

export default async function Home() {
  const { user } = await fetchUser();
  console.log("user", user);

  return (
    <main className="root-layout">
      {user ? <Dashboard user={user} /> : <LandingPage />}
    </main>
  );
}
