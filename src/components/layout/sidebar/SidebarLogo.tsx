// src/components/layout/sidebar/SidebarLogo.tsx
/**
 * @file src/components/layout/sidebar/SidebarLogo.tsx
 * @description Aparato de UI atómico y puro para renderizar el logo.
 *              Sincronizado para consumir el namespace de i18n canónico.
 * @author Raz Podestá
 * @version 2.1.0
 */
"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/lib/navigation";

export function SidebarLogo(): React.ReactElement {
  // --- INICIO DE CORRECCIÓN DE I18N ---
  const t = useTranslations("components.layout.DashboardSidebar");
  // --- FIN DE CORRECCIÓN DE I18N ---

  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 font-semibold text-foreground"
        aria-label={t("logo_aria_label")}
      >
        <Image
          src="/images/logo.png"
          width={32}
          height={32}
          alt={t("logo_alt_text")}
          priority
        />
        <span>{t("brand_name")}</span>
      </Link>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de `MISSING_MESSAGE`**: ((Implementada)) Se ha corregido la llamada a `useTranslations` al namespace canónico, resolviendo el error de renderizado del nombre de la marca.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/SidebarLogo.tsx
