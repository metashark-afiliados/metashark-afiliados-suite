// src/components/layout/sidebar/NavList.tsx
/**
 * @file NavList.tsx
 * @description Aparato de UI atómico y soberano. Renderiza la lista de
 *              navegación principal y de desarrollador. Consume sus propias
 *              traducciones y contexto para la lógica de renderizado condicional.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 6.0.0
 */
"use client";

import { Palette, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { clientLogger } from "@/lib/logger";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { primaryNavLinks } from "./primary-sidebar.config";

/**
 * @private
 * @component NavLink
 * @description Sub-componente de presentación puro para un único enlace de navegación.
 * @param {object} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
const NavLink = ({
  href,
  label,
  icon: Icon,
}: {
  href: any;
  label: string;
  icon: React.ElementType;
}) => {
  const pathname = usePathname();
  const hrefAsString = typeof href === "string" ? href : (href.pathname ?? "/");
  const isActive =
    pathname === hrefAsString ||
    (hrefAsString !== "/dashboard" && pathname.startsWith(hrefAsString));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50",
        isActive &&
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

const NavListSkeleton = () => (
  <nav className="grid items-start gap-1 px-2 py-4 lg:px-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-9 w-full rounded-lg bg-muted animate-pulse" />
    ))}
  </nav>
);

/**
 * @public
 * @component NavList
 * @description Renderiza la lista de enlaces de navegación para la barra lateral secundaria.
 *              Es un componente soberano.
 * @returns {React.ReactElement}
 */
export function NavList(): React.ReactElement {
  const { user } = useDashboard();
  const { tSidebar } = useDashboardTranslations();
  clientLogger.trace("[NavList] Renderizando componente soberano.");

  if (!user) {
    return <NavListSkeleton />;
  }

  const userRole = (user.app_metadata?.app_role || "user") as
    | "user"
    | "developer";

  const mainNavLinks = primaryNavLinks.map((link) => ({
    href: link.href,
    label: tSidebar(link.i18nKey as any),
    icon: link.icon,
  }));

  if (userRole === "developer") {
    mainNavLinks.push(
      {
        href: "/dashboard/resources/icons",
        label: tSidebar("iconLibrary"),
        icon: Palette,
      },
      { href: "/dev-console", label: tSidebar("devConsole"), icon: ShieldCheck }
    );
  }

  return (
    <nav className="grid items-start gap-1 px-2 py-4 text-sm font-medium lg:px-4">
      {mainNavLinks.map((link) => {
        const key =
          typeof link.href === "string" ? link.href : link.href.pathname;
        return <NavLink key={key} {...link} />;
      })}
    </nav>
  );
}
// src/components/layout/sidebar/NavList.tsx
