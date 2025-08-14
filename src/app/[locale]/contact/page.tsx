// src/app/[locale]/contact/page.tsx
/**
 * @file page.tsx
 * @description Orquestador de servidor para la página de Contacto.
 *              Obtiene todo el contenido estructurado de la capa de i18n y
 *              lo pasa al componente de cliente para su renderizado.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ContactPageClient, type ContactPageData } from "./contact-page-client";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pages.ContactPage" });
  return { title: t("hero.title") };
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("pages.ContactPage");

  const pageData: ContactPageData = {
    hero: {
      title: t("hero.title"),
      subtitle: t("hero.subtitle"),
    },
    form: {
      title: t("form.title"),
    },
    contactInfo: {
      title: t("contactInfo.title"),
      cards: t.raw("contactInfo.cards"),
    },
  };

  return <ContactPageClient data={pageData} />;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Patrón Servidor-Cliente**: ((Implementada)) El Server Component es ahora un orquestador de datos puro.
 * =====================================================================
 */
// src/app/[locale]/contact/page.tsx
