// src/components/dashboard/Breadcrumbs.tsx
/**
 * @file Breadcrumbs.tsx
 * @description Aparato de UI de élite que construye y renderiza dinámicamente
 *              las migas de pan de navegación basándose en la ruta actual.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations("DashboardPage.breadcrumbs");

  // Lógica de construcción de migas de pan
  const pathSegments = pathname.split("/").filter(Boolean);
  // Eliminar el locale (primer segmento)
  if (pathSegments.length > 0) {
    pathSegments.shift();
  }

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    // Intentar traducir el segmento; si no hay traducción, usar el segmento capitalizado.
    const label = t(segment as any, {
      defaultValue: segment.charAt(0).toUpperCase() + segment.slice(1),
    });
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link
              href={item.href as any}
              className={cn(
                "font-medium",
                index === breadcrumbItems.length - 1
                  ? "text-foreground pointer-events-none"
                  : "text-muted-foreground transition-colors hover:text-foreground"
              )}
              aria-current={
                index === breadcrumbItems.length - 1 ? "page" : undefined
              }
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Navegación Contextual:** Mejora drásticamente la UX al proporcionar orientación espacial al usuario dentro del dashboard.
 * =====================================================================
 */
// src/components/dashboard/Breadcrumbs.tsx
