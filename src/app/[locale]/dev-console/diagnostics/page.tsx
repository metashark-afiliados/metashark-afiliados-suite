// src/app/[locale]/dev-console/diagnostics/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de servidor para la página de Diagnóstico del Sistema.
 *              Obtiene las traducciones y las pasa al componente de cliente.
 *              Corregido para utilizar una importación explícita con extensión.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 * @see .docs-espejo/app/[locale]/dev-console/diagnostics/page.tsx.md
 */
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { logger } from "@/lib/logger";
import {
  DiagnosticsClient,
  type DiagnosticsPageTexts,
} from "./diagnostics-client.tsx";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "pages.DevConsoleDiagnostics",
  });
  return {
    title: t("metadata_title"),
  };
}

export default async function DiagnosticsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  logger.trace(
    `[DiagnosticsPage] Renderizando orquestador de servidor para locale: ${locale}`
  );
  const t = await getTranslations("pages.DevConsoleDiagnostics");

  const texts: DiagnosticsPageTexts = {
    title: t("title"),
    description: t("description"),
    connectivity: {
      title: t("connectivity.title"),
      description: t("connectivity.description"),
      sentry_ok: t("connectivity.sentry_ok"),
      sentry_fail: t("connectivity.sentry_fail"),
    },
    actions: {
      title: t("actions.title"),
      description: t("actions.description"),
      frontend_error_button: t("actions.frontend_error_button"),
      frontend_error_toast: t("actions.frontend_error_toast"),
      backend_error_button: t("actions.backend_error_button"),
      backend_error_toast_success: t("actions.backend_error_toast_success"),
      backend_error_toast_fail: t("actions.backend_error_toast_fail"),
    },
  };

  return <DiagnosticsClient texts={texts} />;
}
// src/app/[locale]/dev-console/diagnostics/page.tsx
