// src/app/[locale]/disclaimer/page.tsx
/**
 * @file page.tsx
 * @description Página de Descargo de Responsabilidad. Ha sido corregida para
 *              pasar el nombre de ícono correcto (`AlertOctagon`) al
 *              `LegalPageLayout`, eliminando la advertencia de build.
 * @author Raz Podestá
 * @version 1.1.0
 */
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "pages.DisclaimerPage",
  });
  return { title: t("title") };
}

export default async function DisclaimerPage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations("pages.DisclaimerPage");
  return (
    <LegalPageLayout
      icon="AlertOctagon" // <-- CORRECCIÓN: El nombre del ícono ahora es PascalCase.
      title={t("title")}
      content={t.raw("content")}
    />
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Datos**: ((Implementada)) Se ha corregido el nombre del ícono a `AlertOctagon`, que es el nombre de exportación correcto de `lucide-react`, eliminando la advertencia de la consola de build.
 * =====================================================================
 */
// src/app/[locale]/disclaimer/page.tsx
