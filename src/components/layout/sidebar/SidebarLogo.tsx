// src/components/layout/sidebar/SidebarLogo.tsx
/**
 * @file SidebarLogo.tsx
 * @description Aparato de UI atómico y soberano. Renderiza el logo y el nombre
 *              de la marca. Consume sus propias traducciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import Image from "next/image";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { Link } from "@/lib/navigation";

export function SidebarLogo() {
  const { tSidebar } = useDashboardTranslations();
  return (
    <div className="flex h-16 items-center border-b px-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 font-semibold"
        aria-label={tSidebar("logo_aria_label")}
      >
        <Image
          src="/images/logo.png"
          alt={tSidebar("logo_alt_text")}
          width={32}
          height={32}
          priority
        />
        <span className="text-lg font-bold text-foreground">
          {tSidebar("brand_name")}
        </span>
      </Link>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Restauración de Archivo y Soberanía:** El componente ha sido reconstruido, exportado y hecho soberano, resolviendo `TS2459` y `TS2307`.
 * =====================================================================
 */
// src/components/layout/sidebar/SidebarLogo.tsx
