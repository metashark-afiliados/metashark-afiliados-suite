// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Página de registro. Refactorizada para ser completamente
 *              autónoma en su consumo de i18n.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

import { SignupForm } from "@/components/authentication/sign-up-form";
import { AuthCardLayout } from "@/components/layout/AuthCardLayout";
import { clientLogger } from "@/lib/logging";
import { SmartLink } from "@/components/ui/SmartLink";

export default function SignupPage(): React.ReactElement {
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
 * 1. **Resolución de `MISSING_MESSAGE` y `FORMATTING_ERROR`**: ((Implementada)) Se ha eliminado la dependencia del namespace de `login` y se ha corregido la llamada a `t.rich`, resolviendo los errores de Vercel.
 * 2. **Autonomía de Módulo (LEGO)**: ((Implementada)) El componente ahora es 100% autocontenido, cumpliendo con la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `SignupForm` Puro**: ((Vigente)) Similar a `LoginForm`, el `SignupForm` podría ser refactorizado para recibir todos sus textos como props, convirtiéndolo en un componente de presentación 100% puro.
 *
 * =====================================================================
 */
// src/app/[locale]/signup/page.tsx
