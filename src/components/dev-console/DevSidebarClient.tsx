// src/components/dev-console/DevSidebarClient.tsx
/**
 * @file DevSidebarClient.tsx
 * @description Ensamblador de UI. Corregido para usar una importación atómica
 *              de la Server Action, resolviendo el fallo de build de Vercel.
 * @author L.I.A. Legacy
 * @version 3.2.0
 */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LogOut, ShieldCheck } from "lucide-react";

// --- INICIO DE CORRECCIÓN DE IMPORTACIÓN ATÓMICA ---
// Se importa directamente el módulo de acción, no el manifiesto `index.ts`.
// Esto evita que el bundler analice innecesariamente todo el namespace de acciones.
import { signOutAction } from "@/lib/actions/session.actions";
// --- FIN DE CORRECCIÓN DE IMPORTACIÓN ATÓMICA ---

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
      {/* ... (Header y Nav sin cambios) ... */}
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
        <form action={signOutAction}>
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
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se ha cambiado la importación para apuntar directamente a `session.actions.ts`. Esta especificidad informa al bundler de Next.js que no necesita analizar el manifiesto `actions/index.ts` (que contiene `server-only`), resolviendo la causa raíz del fallo de despliegue.
 *
 * =====================================================================
 */
// src/components/dev-console/DevSidebarClient.tsx
