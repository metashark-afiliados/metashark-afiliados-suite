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
      icon="AlertOctagon" // <-- VERIFICADO: El nombre del ícono es PascalCase.
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
 * 1. **Sincronización de Datos y Contrato**: ((Implementada)) Se ha verificado que el nombre del ícono `AlertOctagon` coincide con el nombre de exportación correcto de `lucide-react`. Esto elimina la advertencia de `[DynamicIcon] Ícono no encontrado` durante el proceso de build.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Iconos en la Capa de i18n**: ((Vigente)) Para una robustez de élite, el schema de Zod para las páginas legales podría validar que el valor del `icon` sea uno de los nombres válidos de la librería `lucide-react`, previniendo este tipo de errores a nivel de contrato de datos.
 *
 * =====================================================================
 */
// src/app/[locale]/disclaimer/page.tsx
