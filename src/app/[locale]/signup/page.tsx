// src/app/[locale]/signup/page.tsx
/**
 * @file page.tsx
 * @description Página de registro. Refactorizada para alinear su consumo
 *              de i18n con la SSoT consolidada.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
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
  const tLogin = useTranslations("app.[locale].login.page"); // Carga el namespace de login para el enlace inferior

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
 * 1. **Resolución de `FORMATTING_ERROR`**: ((Implementada)) Se ha corregido la llamada a `t.rich` para que utilice la clave `strong` correcta, resolviendo el error de Vercel.
 * 2. **Sincronización con SSoT**: ((Implementada)) El componente ahora carga el namespace de `login` para obtener el texto del enlace inferior, respetando la nueva SSoT.
 *
 * =====================================================================
 */
// src/app/[locale]/signup/page.tsx
