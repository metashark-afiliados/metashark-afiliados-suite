// src/components/layout/sidebar/NavList.tsx
/**
 * @file NavList.tsx
 * @description Aparato de UI atómico y soberano. Renderiza la lista de
 *              navegación principal y la de desarrollador.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Palette, ShieldCheck } from "lucide-react";

import { useDashboard } from "@/lib/context/DashboardContext";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { primaryNavLinks } from "./primary-sidebar.config"; // Assuming this is the correct config for secondary as well

function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: any;
  label: string;
  icon: React.ElementType;
}) {
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
}

const NavListSkeleton = () => (
  <nav className="grid items-start gap-1 px-2 py-4 lg:px-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-9 w-full rounded-lg bg-muted animate-pulse" />
    ))}
  </nav>
);

export function NavList(): React.ReactElement {
  const { user } = useDashboard();
  const { tSidebar } = useDashboardTranslations();

  if (!user) {
    return <NavListSkeleton />;
  }

  const userRole = (user.app_metadata?.app_role || "user") as
    | "user"
    | "developer";

  const mainNavLinks = primaryNavLinks.map((link) => ({
    href: link.href,
    label: tSidebar(link.i18nKey),
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
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Soberanía de i18n:** El componente ya no depende de props de traducción.
 * =====================================================================
 */
// src/components/layout/sidebar/NavList.tsx
