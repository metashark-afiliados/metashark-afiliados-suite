/**
 * @file page.tsx
 * @description Página de registro. Ha sido refactorizada a un estándar de élite
 *              para consumir los namespaces de i18n completos y canónicos,
 *              resolviendo un error crítico de `MISSING_MESSAGE` durante el build
 *              en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

import { SignupForm } from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * @public
 * @page SignupPage
 * @description Ensambla el `AuthCardLayout` y el `SignupForm` para construir la
 *              vista de registro completa.
 * @returns {React.ReactElement}
 */
export default function SignupPage(): React.ReactElement {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (I18N Namespace) ---
  // Se consumen los namespaces completos y canónicos según la SSoT (i18n.ts),
  // resolviendo el error `MISSING_MESSAGE` que bloqueaba el build.
  const t = useTranslations("app.[locale].signup.page");
  const tLogin = useTranslations("app.[locale].login.page");
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

  const bottomLink = tLogin.rich("alreadyHaveAccount", {
    signin: (chunks) => (
      <SmartLink
        href="/login"
        label={chunks}
        className="text-primary hover:underline"
      />
    ),
  });

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <SignupForm />
    </AuthCardLayout>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se han corregido las llamadas a `useTranslations` con los namespaces canónicos, resolviendo las múltiples instancias del error `MISSING_MESSAGE` asociadas a esta página.
 *
 * @subsection Melhorias Futuras
 * 1. **Metadatos Dinámicos**: ((Vigente)) Convertir a un Server Component para poder usar la función `generateMetadata` y establecer el título de la página de forma dinámica y traducida.
 *
 * =====================================================================
 */
