// src/app/[locale]/disclaimer/page.tsx
/**
 * @file page.tsx
 * @description Página de Descargo de Responsabilidad. Ha sido refactorizado a un
 *              estándar de élite para pasar el nombre de ícono canónico y válido
 *              `OctagonAlert` al `LegalPageLayout`, eliminando la advertencia de
 *              build y garantizando la integridad visual.
 * @author L.I.A. Legacy
 * @version 2.0.0
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
      icon="OctagonAlert"
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
 * 1. **Sincronización de Íconos y Eliminación de Advertencia**: ((Implementada)) Se ha reemplazado el nombre de ícono inválido "AlertOctagon" por el nombre canónico y semánticamente correcto "OctagonAlert" de `lucide-react`. Esto elimina la advertencia de `DynamicIcon` durante el proceso de build.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Iconos en la Capa de i18n**: ((Vigente)) Para una robustez de élite, el schema de Zod para las páginas legales podría validar que el valor del `icon` sea uno de los nombres válidos de `lucide-react`, previniendo este tipo de error a nivel de contrato de datos.
 *
 * =====================================================================
 */
// src/app/[locale]/disclaimer/page.tsx
