/**
 * @file src/components/layout/sidebar/SidebarLogo.tsx
 * @description Aparato de UI atómico y puro para renderizar el logo y el nombre
 *              de la marca en la barra lateral. Es completamente agnóstico al
 *              contenido, consumiendo sus textos desde la capa de internacionalización.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/lib/navigation";

export function SidebarLogo(): React.ReactElement {
  const t = useTranslations("DashboardSidebar");

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
 * 1. **Componente de Identidad Visual**: ((Implementada)) Reconstruye un componente esencial para la identidad de la marca.
 * 2. **Full Internacionalización y Accesibilidad**: ((Implementada)) Cumple con los protocolos de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Logo Dinámico por Workspace**: ((Vigente)) Podría aceptar un `logoUrl` opcional desde el contexto.
 *
 * =====================================================================
 */
