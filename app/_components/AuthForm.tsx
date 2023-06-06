"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthForm() {
  const supabaseClient = createClientComponentClient();

  return (
    <Auth
      supabaseClient={supabaseClient}
      appearance={{ theme: ThemeSupa }}
      providers={["discord"]}
      redirectTo={`http://localhost:3000/auth/callback`}
      onlyThirdPartyProviders
    />
  );
}
