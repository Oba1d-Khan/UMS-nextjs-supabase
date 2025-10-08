import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = "/account";

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}

// import { type EmailOtpType } from "@supabase/supabase-js";
// import { type NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   let token_hash = searchParams.get("token_hash");
//   let type = searchParams.get("type") as EmailOtpType | null;

//   console.log("🔐 Auth Confirm - Initial params:", { token_hash, type });

//   // If no token_hash in query params, check if it's in the Supabase URL format
//   if (!token_hash) {
//     const url = new URL(request.url);
//     const pathParts = url.pathname.split('/');

//     // Handle Supabase's default URL format: /auth/confirm#token_hash=xxx&type=signup
//     if (url.hash) {
//       const hashParams = new URLSearchParams(url.hash.substring(1));
//       token_hash = hashParams.get("token_hash");
//       type = hashParams.get("type") as EmailOtpType | null;
//     }

//     console.log("🔐 Auth Confirm - After hash parsing:", { token_hash, type });
//   }

//   if (token_hash && type) {
//     const supabase = await createClient();

//     try {
//       const { error } = await supabase.auth.verifyOtp({
//         type,
//         token_hash,
//       });

//       if (error) {
//         console.error("❌ OTP verification failed:", error);
//         return NextResponse.redirect(new URL('/auth/error?message=' + encodeURIComponent(error.message), request.url));
//       }

//       console.log("✅ OTP verified successfully!");

//       // Create a new session and redirect to account
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session) {
//         return NextResponse.redirect(new URL('/account', request.url));
//       } else {
//         return NextResponse.redirect(new URL('/login?message=Verification successful, please sign in', request.url));
//       }
//     } catch (error: any) {
//       console.error("❌ Verification error:", error);
//       return NextResponse.redirect(new URL('/auth/error?message=' + encodeURIComponent(error.message), request.url));
//     }
//   }

//   console.error("❌ Missing token_hash or type");
//   console.log("🔍 Full URL:", request.url);
//   return NextResponse.redirect(new URL('/auth/error?message=Invalid verification link: missing token or type', request.url));
// }
