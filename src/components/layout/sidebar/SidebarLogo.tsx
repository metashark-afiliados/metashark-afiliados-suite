// src/components/layout/sidebar/SidebarLogo.tsx
/**
 * @file src/components/layout/sidebar/SidebarLogo.tsx
 * @description Aparato de UI atómico y puro para renderizar el logo y el nombre
 *              de la marca en la barra lateral. Es completamente agnóstico al
 *              contenido, consumiendo sus textos desde la capa de internacionalización.
 *              ¡IMPORTANTE!: Refactorizado para Rebranding Completo.
 * @author Raz Podestá
 * @version 2.0.1
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
          // --- INICIO DE REFACTORIZACIÓN: Rebranding ---
          alt={t("logo_alt_text")} // Consumir del i18n
          // --- FIN DE REFACTORIZACIÓN ---
          priority
        />
        {/* --- INICIO DE REFACTORIZACIÓN: Rebranding --- */}
        <span>{t("brand_name")}</span> {/* Consumir del i18n */}
        {/* --- FIN DE REFACTORIZACIÓN --- */}
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
 * 1. **Rebranding Completo**: ((Implementada)) Se ha actualizado el `alt` del logo de la imagen y el texto del `span` a consumir de las claves de i18n (`logo_alt_text`, `brand_name`), asegurando la coherencia de marca con el `REBRANDING_MANIFESTO.md`.
 *
 * @subsection Melhorias Futuras
 * 1. **Logo Dinámico por Workspace**: ((Vigente)) Podría aceptar un `logoUrl` opcional desde el contexto.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/SidebarLogo.tsx
