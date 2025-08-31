// src/components/layout/sidebar/SidebarLogo.tsx
/**
 * @file SidebarLogo.tsx
 * @description Aparato de UI atómico y soberano. Renderiza el logo y el nombre
 *              de la marca. Consume sus propias traducciones.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
"use client";

import Image from "next/image";

import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { Link } from "@/lib/navigation";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @component SidebarLogo
 * @description Renderiza el logo y el nombre de la marca en la barra lateral,
 *              enlazando a la página principal del dashboard.
 * @returns {React.ReactElement}
 */
export function SidebarLogo(): React.ReactElement {
  const { tSidebar } = useDashboardTranslations();
  clientLogger.trace("[SidebarLogo] Renderizando componente soberano.");

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
// src/components/layout/sidebar/SidebarLogo.tsx
