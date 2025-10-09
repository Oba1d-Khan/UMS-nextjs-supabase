import { createClient as createServerClient } from "../supabase/server";
import { createClient as createBrowserClient } from "../supabase/client";

async function supabaseClient(isServer: boolean) {
  return isServer ? await createServerClient() : createBrowserClient();
}

/** Fetch authenticated user */
export async function fetchUser(isServer = true) {
  const supabase = await supabaseClient(isServer);
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user ?? null, error };
}

/** Fetch current session */
export async function fetchSession(isServer = true) {
  const supabase = await supabaseClient(isServer);
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session ?? null, error };
}

/** Combined utility */
export async function fetchAuthData({
  user = false,
  session = false,
  isServer = true,
}: {
  user?: boolean;
  session?: boolean;
  isServer?: boolean;
} = {}) {
  const [userResult, sessionResult] = await Promise.all([
    user ? fetchUser(isServer) : Promise.resolve({ user: null, error: null }),
    session
      ? fetchSession(isServer)
      : Promise.resolve({ session: null, error: null }),
  ]);

  return {
    // 🔥 Flatten the structure
    user: userResult.user,
    session: sessionResult.session,

    // Optional but useful if you want error access
    errors: {
      userError: userResult.error,
      sessionError: sessionResult.error,
    },
  };
}
