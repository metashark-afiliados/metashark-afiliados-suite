// src/components/auth/LoginForm.tsx
/**
 * @file src/components/auth/LoginForm.tsx
 * @description Componente de cliente que encapsula y configura la UI de autenticación
 *              de Supabase. Es el aparato central para la estrategia de autenticación
 *              delegada. Ha sido nivelado a un estándar de élite con carga dinámica
 *              para optimizar el rendimiento y un manejo de errores robusto.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { type I18nVariables } from "@supabase/auth-ui-shared";
import { type Provider, type SupabaseClient } from "@supabase/supabase-js";
import { AlertCircle, Loader2 } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { clientLogger } from "@/lib/logging";
import { brandTheme } from "@/lib/supabase/auth-theme";
import { createClient } from "@/lib/supabase/client";

const AuthLoader = () => (
  <div className="flex h-64 items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

const DynamicAuth = dynamic(
  () => import("@supabase/auth-ui-react").then((mod) => mod.Auth),
  {
    loading: () => <AuthLoader />,
    ssr: false,
  }
);

/**
 * @private
 * @function getOAuthProviders
 * @description Lee las variables de entorno para determinar qué proveedores de OAuth mostrar.
 * @returns {Provider[]} Un array de strings de proveedores válidos para Supabase.
 */
function getOAuthProviders(): Provider[] {
  const providersEnv = process.env.NEXT_PUBLIC_OAUTH_PROVIDERS || "google";
  const validProviders: Provider[] = ["google", "github", "apple"];
  return providersEnv
    .split(",")
    .map((p) => p.trim() as Provider)
    .filter((p) => validProviders.includes(p));
}

/**
 * @public
 * @interface LoginFormProps
 * @description Define el contrato de props para el `LoginForm`.
 */
interface LoginFormProps {
  view: "sign_in" | "sign_up";
  localization: I18nVariables;
}

/**
 * @public
 * @component LoginForm
 * @description Renderiza el componente de autenticación de Supabase configurado.
 * @param {LoginFormProps} props - Propiedades para configurar el formulario.
 * @returns {React.ReactElement}
 */
export function LoginForm({
  view,
  localization,
}: LoginFormProps): React.ReactElement {
  const t = useTranslations("SupabaseAuthUI");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const next = searchParams.get("next");

  const providers = getOAuthProviders();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    clientLogger.error(
      "[LoginForm] FATAL: La variable de entorno NEXT_PUBLIC_SITE_URL no está configurada."
    );
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t("error_system_configuration")}</AlertDescription>
      </Alert>
    );
  }

  const redirectUrl = next
    ? `${siteUrl}/api/auth/callback?next=${encodeURIComponent(next)}`
    : `${siteUrl}/api/auth/callback`;

  return (
    <div className="space-y-4">
      {error && message && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <DynamicAuth
        supabaseClient={createClient() as SupabaseClient}
        appearance={{ theme: brandTheme }}
        theme="dark"
        providers={providers}
        redirectTo={redirectUrl}
        socialLayout="horizontal"
        view={view}
        showLinks={false}
        localization={{ variables: localization }}
      />
    </div>
  );
}

/**
 * =====================================================================
 *                           REPORTE POST-CÓDIGO
 * =====================================================================
 * @analisis_de_impacto
 * Este aparato es la pieza central de la nueva arquitectura de autenticación
 * delegada. Su creación reemplaza a los antiguos `LoginForm` y `SignUpForm`,
 * unificando la UI. Es una dependencia crítica para `login/page.tsx` y
 * `signup/page.tsx`, y su reconstrucción es esencial para estabilizar
 * el flujo de autenticación.
 *
 * @protocolo_de_transparencia
 * LOC Anterior: 0 (Inexistente en el snapshot actual, reconstruido)
 * LOC Atual: 105
 * Justificación: Creación de un nuevo aparato de élite siguiendo el
 * manifiesto de arquitectura. Incluye carga dinámica, manejo de errores
 * de configuración y lógica de redirección inteligente.
 *
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Rendimiento de Carga (Lazy Loading)**: ((Implementada)) El componente pesado `@supabase/auth-ui-react` ahora se carga dinámicamente.
 * 2. **Experiencia de Usuario (UX)**: ((Implementada)) Se muestra un `AuthLoader` (un spinner) mientras se carga el componente dinámico.
 * 3. **Manejo de Errores de Configuración**: ((Implementada)) El componente ahora verifica la existencia de `NEXT_PUBLIC_SITE_URL` y renderiza un estado de error claro.
 *
 * @subsection Melhorias Futuras
 * 1. **Error Boundary**: ((Vigente)) Envolver el `<DynamicAuth>` en un `ErrorBoundary` de React para capturar posibles errores de renderizado.
 *
 * =====================================================================
 */
// src/components/auth/LoginForm.tsx
