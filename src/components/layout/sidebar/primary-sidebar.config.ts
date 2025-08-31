// src/components/layout/sidebar/primary-sidebar.config.ts
/**
 * @file primary-sidebar.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para los
 *              enlaces de la barra de navegación primaria. Ha sido refactorizado
 *              con tipado explícito para resolver un error de tipo TS2322.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.1.0
 */
import { FolderKanban, Home, LayoutTemplate, Library } from "lucide-react";

import { type Route } from "@/lib/navigation";

export interface PrimaryNavLink {
  href: Route;
  i18nKey: "nav_home" | "nav_projects" | "nav_templates" | "nav_brand";
  icon: React.ElementType;
  isPro?: boolean;
}

/**
 * @public
 * @constant primaryNavLinks
 * @description La SSoT para los enlaces de navegación de la barra lateral primaria.
 *              La aserción de tipo explícita `: PrimaryNavLink[]` garantiza
 *              la seguridad de tipos de cada 'href' contra el contrato 'Route'.
 */
export const primaryNavLinks: PrimaryNavLink[] = [
  { href: "/dashboard", i18nKey: "nav_home", icon: Home },
  { href: "/dashboard/sites", i18nKey: "nav_projects", icon: FolderKanban },
  {
    href: "/dashboard/templates",
    i18nKey: "nav_templates",
    icon: LayoutTemplate,
  },
  {
    href: "/dashboard/brand",
    i18nKey: "nav_brand",
    icon: Library,
    isPro: true,
  },
];
// src/components/layout/sidebar/primary-sidebar.config.ts
