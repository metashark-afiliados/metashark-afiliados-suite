// src/components/layout/sidebar/primary-sidebar.config.ts
/**
 * @file primary-sidebar.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para los
 *              enlaces de la barra de navegación primaria.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import {
  Bell,
  FolderKanban,
  Home,
  LayoutTemplate,
  Library,
  Plus,
  Trash2,
} from "lucide-react";

interface PrimaryNavLink {
  href: any;
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
