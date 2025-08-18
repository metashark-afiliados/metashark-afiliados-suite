// src/components/auth/OAuthButton.tsx
/**
 * @file src/components/auth/OAuthButton.tsx
 * @description Componente de UI atómico y de presentación puro para la autenticación
 *              con proveedores OAuth. Encapsula el formulario, el botón y la lógica
 *              visual para un único proveedor.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { type Provider } from "@supabase/supabase-js";

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

const providerDetails: Record<
  string,
  { icon: React.ElementType; name: string }
> = {
  google: { icon: GoogleIcon, name: "Google" },
};

export interface OAuthButtonProps {
  provider: Provider;
}

export function OAuthButton({
  provider,
}: OAuthButtonProps): React.ReactElement {
  const t = useTranslations("OAuthButton");
  const details = providerDetails[provider];

  if (!details) {
    clientLogger.error(`[OAuthButton] Proveedor no soportado: ${provider}`);
    return <></>; // No renderizar nada si el proveedor no está configurado
  }

  const { icon: Icon, name } = details;

  return (
    <form action={signInWithOAuthAction}>
      <input type="hidden" name="provider" value={provider} />
      <Button variant="outline" className="w-full" type="submit">
        <Icon />
        {t("signInWithProvider", { provider: name })}
      </Button>
    </form>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical**: ((Implementada)) Este nuevo aparato encapsula perfectamente la lógica y UI para un botón de OAuth, mejorando la reutilización y simplificando el `LoginForm`.
 * 2. **Arquitectura Declarativa**: ((Implementada)) Utiliza un registro `providerDetails` para una fácil expansión a futuros proveedores (GitHub, Apple) sin modificar la lógica del componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte para Más Proveedores**: ((Vigente)) Añadir los detalles para 'github' y 'apple' al registro `providerDetails` para habilitar más opciones de login.
 * 2. **Estado de Carga**: ((Vigente)) Utilizar `useFormStatus` para mostrar un estado de carga en el botón mientras se procesa la redirección de la Server Action.
 *
 * =====================================================================
 */
// src/components/auth/OAuthButton.tsx
