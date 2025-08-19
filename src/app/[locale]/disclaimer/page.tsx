// src/app/[locale]/disclaimer/page.tsx
/**
 * @file page.tsx
 * @description Página de Descargo de Responsabilidad. Ha sido validada para
 *              confirmar que pasa el nombre de ícono correcto (`AlertOctagon`)
 *              al `LegalPageLayout`, eliminando la advertencia de build.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

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
      icon="AlertOctagon"
      title={t("title")}
      content={t.raw("content")}
    />
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Datos Validada**: ((Implementada)) Se ha verificado que el nombre del icono `AlertOctagon` es el correcto, eliminando la advertencia de build.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Iconos en la Capa de i18n**: ((Vigente)) Para una robustez de élite, el schema de Zod para las páginas legales podría validar que el valor del `icon` sea uno de los nombres válidos de `lucide-react`.
 *
 * =====================================================================
 */
// src/app/[locale]/disclaimer/page.tsx
