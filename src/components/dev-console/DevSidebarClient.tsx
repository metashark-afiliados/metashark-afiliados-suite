// src/components/dev-console/DevSidebarClient.tsx
/**
 * @file DevSidebarClient.tsx
 * @description Ensamblador de UI puro para la barra lateral del Dev Console.
 *              Corregido para restaurar la importación del hook `useTranslations`.
 * @author L.I.A. Legacy
 * @version 3.1.1
 */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
// --- INICIO DE CORRECCIÓN DE DEPENDENCIA ---
import { useTranslations } from "next-intl";
// --- FIN DE CORRECCIÓN DE DEPENDENCIA ---
import { LogOut, ShieldCheck } from "lucide-react";

import { session as sessionActions } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { NavLink } from "./sidebar/NavLink";
import { RouteTreeViewer, type RouteNode } from "./sidebar/RouteTreeViewer";
import { devConsoleNavLinks } from "./sidebar/sidebar.config";
import { logger } from "@/lib/logging";

export function DevSidebarClient() {
  const t = useTranslations("components.dev-console.DevSidebar");
  const [routes, setRoutes] = useState<RouteNode | null>(null);

  useEffect(() => {
    fetch("/routes-manifest.json")
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch")))
      .then(setRoutes)
      .catch((error) =>
        logger.warn("[DevSidebarClient] Could not load routes manifest.", {
          error,
        })
      );
  }, []);

  return (
    <aside className="w-72 flex-shrink-0 border-r bg-card h-screen flex flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dev-console"
          className="flex items-center gap-2 font-bold text-lg"
        >
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>DEV CONSOLE</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {devConsoleNavLinks.map((link) => {
          const key =
            typeof link.href === "string" ? link.href : link.href.pathname;
          return (
            <NavLink
              key={key}
              href={link.href}
              label={t(link.i18nKey as any)}
              icon={link.icon}
            />
          );
        })}
        <RouteTreeViewer routes={routes} />
      </nav>
      <div className="mt-auto border-t p-4">
        <form action={sessionActions.signOutAction}>
          <Button
            variant="ghost"
            className="w-full justify-start"
            type="submit"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("signOut")}
          </Button>
        </form>
      </div>
    </aside>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia Crítica (TS2304)**: ((Implementada)) Se ha restaurado la importación de `useTranslations` desde `next-intl`, resolviendo el error de compilación que impedía el funcionamiento del componente.
 *
 * =====================================================================
 */
// src/components/dev-console/DevSidebarClient.tsx
