// src/components/layout/sidebar/NavList.tsx
/**
 * @file src/components/layout/sidebar/NavList.tsx
 * @description Aparato de UI atómico que renderiza la lista de navegación principal
 *              del dashboard. Su contrato de props usa un tipo `href` agnóstico
 *              para resolver conflictos de tipos con `next-intl`.
 * @author Raz Podestá
 * @version 2.1.0
 */
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Globe,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Sparkles,
  Palette,
} from "lucide-react";

import { useDashboard } from "@/lib/context/DashboardContext";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: any;
  label: string;
  icon: React.ElementType;
}

function NavLink({ href, label, icon: Icon }: NavLinkProps) {
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
  const t = useTranslations("DashboardSidebar");

  if (!user) {
    return <NavListSkeleton />;
  }

  const userRole = (user.app_metadata?.app_role || "user") as
    | "user"
    | "developer";

  const mainNavLinks: NavLinkProps[] = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/dashboard/sites", label: t("mySites"), icon: Globe },
    { href: "/lia-chat", label: t("liaChat"), icon: Sparkles },
    { href: "/dashboard/settings", label: t("settings"), icon: Settings },
  ];

  if (userRole === "developer") {
    // --- INICIO DE MODIFICACIÓN ---
    mainNavLinks.push(
      {
        href: "/dashboard/resources/icons",
        label: t("iconLibrary"), // Nueva clave i18n
        icon: Palette,
      },
      {
        href: "/dev-console",
        label: t("devConsole"),
        icon: ShieldCheck,
      }
    );
    // --- FIN DE MODIFICACIÓN ---
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
