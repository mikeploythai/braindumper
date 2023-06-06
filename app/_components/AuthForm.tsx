"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const origin = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, _) => {
      if (event === "SIGNED_IN") {
        router.refresh();
      }
    });
  }, [supabase]);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["discord"]}
      redirectTo={`${origin}/auth/callback`}
      onlyThirdPartyProviders
    />
  );
}
