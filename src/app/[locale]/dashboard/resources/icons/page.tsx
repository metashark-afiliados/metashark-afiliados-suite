// src/app/[locale]/dashboard/resources/icons/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de servidor para la Galería de Iconos. Su única
 *              responsabilidad es cargar los manifiestos de iconos y las
 *              traducciones, y pasarlos al componente de cliente para su
 *              renderizado.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/app/[locale]/dashboard/resources/icons/page.tsx.md
 */
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

import {
  IconGalleryClient,
  type IconGroup,
} from "@/components/resources/IconGalleryClient";
import { lucideIconNames } from "@/config/lucide-icon-names";
import { logger } from "@/lib/logger";

/**
 * @public
 * @async
 * @function generateMetadata
 * @description Genera los metadatos de la página de forma dinámica.
 * @returns {Promise<Metadata>}
 */
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

/**
 * @public
 * @async
 * @page IconGalleryPage
 * @description Ensambla y renderiza la página de la Galería de Iconos.
 * @returns {Promise<React.ReactElement>}
 */
export default async function IconGalleryPage({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<React.ReactElement> {
  unstable_setRequestLocale(locale);
  logger.trace({}, "[IconGalleryPage] Renderizando orquestador de servidor.");
  const t = await getTranslations("pages.IconGalleryPage");

  const groupedIcons = lucideIconNames.reduce<IconGroup[]>((acc, iconName) => {
    const firstLetter = iconName.charAt(0).toUpperCase();
    let group = acc.find((g) => g.category === firstLetter);
    if (!group) {
      group = { category: firstLetter, icons: [] };
      acc.push(group);
    }
    group.icons.push(iconName);
    return acc;
  }, []);

  logger.trace(
    { groupCount: groupedIcons.length },
    "[IconGalleryPage] Iconos agrupados."
  );

  const clientTexts = {
    searchPlaceholder: t("searchPlaceholder"),
    clearSearchAriaLabel: t("clearSearchAriaLabel"),
    noResults: t("noResults"),
    copySuccessMessage: t("copySuccessMessage"),
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{t("pageTitle")}</h1>
        <p className="text-muted-foreground">{t("pageDescription")}</p>
      </div>
      <IconGalleryClient groupedIcons={groupedIcons} texts={clientTexts} />
    </div>
  );
}
// src/app/[locale]/dashboard/resources/icons/page.tsx
