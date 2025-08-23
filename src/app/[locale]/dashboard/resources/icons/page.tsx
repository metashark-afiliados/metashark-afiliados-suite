// src/app/[locale]/dashboard/resources/icons/page.tsx
/**
 * @file page.tsx
 * @description Server Component para la Galería de Iconos. Lee la SSoT de iconos,
 *              los agrupa por prefijo y pasa los datos al componente cliente.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import React from "react";
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import {
  IconGalleryClient,
  type IconGroup,
} from "@/components/resources/IconGalleryClient";
import { lucideIconNames } from "@/config/lucide-icon-names";
import { logger } from "@/lib/logging";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "pages.IconGalleryPage",
  });
  return {
    title: t("metadataTitle"),
  };
}

export default async function IconGalleryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("pages.IconGalleryPage");

  // Lógica de Agrupación de Élite en Servidor
  const groupedIcons = lucideIconNames.reduce<IconGroup[]>((acc, iconName) => {
    const match = iconName.match(/^[A-Z][a-z]*/);
    const category = match ? match[0] : "Other";

    let group = acc.find((g) => g.category === category);
    if (!group) {
      group = { category, icons: [] };
      acc.push(group);
    }
    group.icons.push(iconName);

    return acc;
  }, []);

  // Ordenar categorías alfabéticamente
  groupedIcons.sort((a, b) => a.category.localeCompare(b.category));

  logger.trace("[IconGalleryPage] Iconos agrupados en el servidor", {
    groupCount: groupedIcons.length,
  });

  const clientProps = {
    groupedIcons,
    texts: {
      searchPlaceholder: t("searchPlaceholder"),
      clearSearchAriaLabel: t("clearSearchAriaLabel"),
      noResults: t("noResults"),
      copySuccessMessage: t("copySuccessMessage"),
    },
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">{t("pageTitle")}</h1>
        <p className="text-muted-foreground">{t("pageDescription")}</p>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <IconGalleryClient {...clientProps} />
      </div>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Procesamiento en Servidor**: ((Implementada)) La costosa operación de agrupar 1300+ iconos se realiza una vez en el servidor, optimizando el rendimiento del cliente.
 * 2. **Desacoplamiento Servidor-Cliente**: ((Implementada)) Sigue el patrón canónico donde el Server Component prepara todos los datos y textos para el Client Component.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/resources/icons/page.tsx
