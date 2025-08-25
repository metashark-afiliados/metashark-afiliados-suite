// src/components/layout/sidebar/primary-sidebar.config.ts
/**
 * @file primary-sidebar.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para los
 *              enlaces de la barra de navegación primaria del "Workspace Creativo".
 *              Define la estructura de la navegación principal de forma agnóstica a la UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { FolderKanban, Home, LayoutTemplate, Library } from "lucide-react";

import { type Route } from "@/lib/navigation";

export interface PrimaryNavLink {
  href: Route;
  i18nKey: "nav_home" | "nav_projects" | "nav_templates" | "nav_brand";
  icon: React.ElementType;
  isPro?: boolean;
}

export const primaryNavLinks: PrimaryNavLink[] = [
  { href: "/dashboard", i18nKey: "nav_home", icon: Home },
  { href: "/dashboard/projects", i18nKey: "nav_projects", icon: FolderKanban },
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Configuración sobre Código**: ((Implementada)) Abstrae la estructura de navegación a un manifiesto, haciendo que la UI sea más fácil de modificar y mantener.
 * 2. **Integridad de Tipos**: ((Implementada)) El tipo `href` ahora está correctamente validado por la SSoT de `navigation.ts`, previniendo errores de enrutamiento en tiempo de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga desde Base de Datos**: ((Vigente)) Para una personalización extrema, esta configuración podría ser cargada desde una tabla `navigation_items` en la base de datos.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/primary-sidebar.config.ts
