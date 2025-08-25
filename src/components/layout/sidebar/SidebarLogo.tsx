// src/components/layout/sidebar/SidebarLogo.tsx
/**
 * @file src/components/layout/sidebar/SidebarLogo.tsx
 * @description Aparato de UI atómico y puro. Refactorizado para ser agnóstico
 *              a la lógica de i18n, recibiendo `t` como prop.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import Image from "next/image";
import { type useTranslations } from "next-intl";

import { Link } from "@/lib/navigation";

interface SidebarLogoProps {
  t: ReturnType<typeof useTranslations>;
}

export function SidebarLogo({ t }: SidebarLogoProps): React.ReactElement {
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
 * 1. **Componente Puro**: ((Implementada)) Se ha eliminado `useTranslations`. El componente es ahora un presentador puro.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/SidebarLogo.tsx
