// src/components/authentication/OAuthButton.tsx
/**
 * @file src/components/authentication/OAuthButton.tsx
 * @description Componente de UI atómico para la autenticación OAuth. Migrado al
 *              directorio canónico `/authentication`. Sincronizado para consumir
 *              los namespaces de i18n canónicos.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import React, { useTransition } from "react";
import { useTranslations } from "next-intl";
import { type Provider } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

import { signInWithOAuthAction } from "@/lib/actions/auth.actions";
import { clientLogger } from "@/lib/logging";
import { Button } from "@/components/ui/button";

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
    <title>Google Logo</title>
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    ></path>
    <path
      fill="#FF3D00"
      d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.612 34.869 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"
    ></path>
  </svg>
);

const AppleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
    <title>Apple Logo</title>
    <path
      fill="currentColor"
      d="M12.01,16.23c-1.42,0-2.83-1-3.66-2.47c-1.12-1.97-2.2-5.24,0.11-7.23c0.94-0.81,2.33-1.2,3.52-1.2c0.41,0,1.3,0.16,2.23,0.93c-1.3,0.85-2.19,2.24-2.19,3.81c0,1.61,0.96,2.94,2.26,3.75c-0.85,0.88-1.88,1.25-2.26,1.25c-0.01,0-0.01,0-0.01,0 M15.11,6.54c-0.05-1.04-0.6-2-1.58-2.58c-0.78-0.46-1.85-0.66-2.77-0.58c1.32,0.84,2.16,2.28,2.16,3.87c0,0.5-0.12,1-0.34,1.44C13.56,8.23,14.49,7.31,15.11,6.54"
    />
  </svg>
);

const providerDetails: Record<
  string,
  { icon: React.ElementType; name: string }
> = {
  google: { icon: GoogleIcon, name: "Google" },
  apple: { icon: AppleIcon, name: "Apple" },
};

export function OAuthButton({
  provider,
}: {
  provider: Provider;
}): React.ReactElement {
  const t = useTranslations("components.auth.OAuthButton");
  const [isPending, startTransition] = useTransition();
  const details = providerDetails[provider];

  if (!details) {
    clientLogger.error(`[OAuthButton] Proveedor no soportado: ${provider}`);
    return <></>;
  }

  const { icon: Icon, name } = details;

  const handleOAuthSignIn = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("provider", provider);
      signInWithOAuthAction(formData);
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleOAuthSignIn}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icon />}
      {t("signInWithProvider", { provider: name })}
    </Button>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Migración a Directorio Canónico**: ((Implementada)) El componente ha sido movido a `src/components/authentication`, consolidando la SSoT.
 * 2. **Sincronización de i18n**: ((Implementada)) La llamada a `useTranslations` ahora utiliza el namespace canónico, garantizando que el texto se renderice correctamente.
 *
 * @subsection Melhorias Futuras
 * 1. **Registro de Proveedores Dinámico**: ((Vigente)) El objeto `providerDetails` podría ser inyectado a través de un contexto o props para permitir añadir nuevos proveedores sin modificar el código del componente.
 *
 * =====================================================================
 */
// src/components/authentication/OAuthButton.tsx
