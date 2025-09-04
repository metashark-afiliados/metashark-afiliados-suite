// src/components/auth/SupabaseAuthUI.tsx
/**
 * @file SupabaseAuthUI.tsx
 * @description Componente de UI atómico y soberano. Encapsula y configura el
 *              componente de autenticación de Supabase. Refactorizado para
 *              alinear el contrato de i18n con la SSoT de la API de Supabase,
 *              resolviendo un error de tipo crítico.
 * @author L.I.A Legacy
 * @version 4.0.0
 * @see .docs-espejo/components/auth/SupabaseAuthUI.tsx.md
 */
"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { type Provider } from "@supabase/supabase-js";

import { brandTheme } from "@/lib/supabase/auth-theme";
import { createClient } from "@/lib/supabase/client";

interface SupabaseAuthUIProps {
  view: "sign_in" | "sign_up" | "magic_link" | "forgotten_password";
}

export function SupabaseAuthUI({ view }: SupabaseAuthUIProps) {
  const supabase = createClient();

  const providers = (
    process.env.NEXT_PUBLIC_OAUTH_PROVIDERS?.split(",") || []
  ).filter(Boolean) as Provider[];

  return (
    <Auth
      supabaseClient={supabase}
      view={view}
      appearance={{ theme: ThemeSupa, extend: true, ...brandTheme }}
      providers={providers}
      redirectTo={`${window.location.origin}/api/auth/callback`}
      localization={{
        variables: {
          // --- INICIO DE CORRECCIÓN DE CONTRATO (TS2353) ---
          magic_link: {
            button_label: "Send Magic Link", // Propiedad correcta
            // ... otras claves de magic_link
          },
          // --- FIN DE CORRECCIÓN DE CONTRATO ---
          verify_otp: {
            email_input_label: "Email Address",
            email_input_placeholder: "Your email address",
            phone_input_label: "Phone Number",
            phone_input_placeholder: "Your phone number",
            token_input_label: "Token",
            token_input_placeholder: "Your one-time password",
            button_label: "Verify Token",
            loading_button_label: "Verifying...",
          },
        },
      }}
    />
  );
}
// src/components/auth/SupabaseAuthUI.tsx
