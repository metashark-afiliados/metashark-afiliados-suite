// src/app/[locale]/login/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de UI soberano para la página de inicio de sesión.
 *              Ensambla el layout y el formulario. El `LoginForm` ahora es
 *              soberano y no recibe props de texto.
 * @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @see .docs-espejo/app/[locale]/login/page.tsx.md
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { LoginForm } from "@/components/authentication/login-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { SmartLink } from "@/components/ui/SmartLink";
import { clientLogger } from "@/lib/logger";

/**
 * @public
 * @page LoginPage
 * @description Orquesta y ensambla la UI de la página de inicio de sesión.
 * @param {object} props - Propiedades de la página, incluyendo el locale.
 * @returns {React.ReactElement}
 */
export default function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactElement {
  clientLogger.trace(
    `[LoginPage] Renderizando orquestador de UI para locale: ${locale}`
  );
  const t = useTranslations("app.[locale].login.page");

  const bottomLink = t.rich("dontHaveAccount", {
    strong: (chunks) => (
      <SmartLink
        href="/signup"
        label={chunks}
        className="font-bold text-primary hover:underline"
      />
    ),
  });

  // --- INICIO DE REFACTORIZACIÓN (TS2322) ---
  // Se elimina la construcción y el pasaje de `loginFormTexts` ya que
  // `LoginForm` ahora es soberano y obtiene sus textos desde su propio hook.
  return (
    <AuthCardLayout bottomLink={bottomLink}>
      <LoginForm />
    </AuthCardLayout>
  );
  // --- FIN DE REFACTORIZACIÓN (TS2322) ---
}
// src/app/[locale]/login/page.tsx
