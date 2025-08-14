// src/app/[locale]/welcome/page.tsx
/**
 * @file src/app/[locale]/welcome/page.tsx
 * @description Punto de entrada para el flujo de onboarding de nuevos usuarios.
 *              Este Server Component renderiza el `OnboardingDialog`, que fuerza
 *              al usuario a crear su primer workspace para poder continuar.
 * @author Raz Podestá
 * @version 1.0.0
 */
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { OnboardingDialog } from "@/components/workspaces/OnboardingDialog";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "WelcomePage" });
  return { title: t("metadata_title") };
}

export default function WelcomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background">
      <OnboardingDialog />
    </main>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Flujo de Onboarding Funcional**: ((Implementada)) La creación de esta página completa un flujo de usuario crítico, resolviendo el error 404.
 *
 * @subsection Melhorias Futuras
 * 1. **UI de Bienvenida Enriquecida**: ((Vigente)) Se podría añadir un fondo animado o elementos visuales a la página para una primera impresión más impactante.
 *
 * =====================================================================
 */
// src/app/[locale]/welcome/page.tsx
