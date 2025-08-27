// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Página de registro. Refactorizada a un estándar de élite para
 *              ser declarada explícitamente como dinámica, resolviendo el
 *              conflicto de renderizado estático en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import {
  SignupForm,
  type SignupFormProps,
} from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";
import { clientLogger } from "@/lib/logging";

// --- INICIO DE CORRECCIÓN DE BUILD (VERCEL) ---
// Declara explícitamente que esta ruta debe ser renderizada dinámicamente.
export const dynamic = "force-dynamic";
// --- FIN DE CORRECCIÓN DE BUILD (VERCEL) ---

export default function SignupPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  unstable_setRequestLocale(locale);
  clientLogger.trace("[SignupPage] Renderizando página de registro.");
  const t = useTranslations("app.[locale].signup.page");

  const bottomLink = t.rich("alreadyHaveAccount", {
    strong: (chunks) => (
      <SmartLink
        href="/login"
        label={chunks}
        className="text-primary hover:underline"
      />
    ),
  });

  const signupFormTexts: SignupFormProps["texts"] = {
    oauth: {
      signInWith: t("signInWith"),
      signInWithProvider: t("signInWithProvider"),
    },
  };

  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <SignupForm texts={signupFormTexts} />
    </AuthCardLayout>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Error Crítico de Build**: Se ha añadido `export const dynamic = 'force-dynamic'`, resolviendo la causa raíz del fallo de despliegue en Vercel para la ruta `/signup`.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) El patrón de `AuthCardLayout` y `bottomLink` es similar entre `LoginPage` y `SignupPage`. Podría ser abstraído a un componente `AuthPageLayout`.
 *
 * =====================================================================
 */
// src/app/[locale]/signup/page.tsx
