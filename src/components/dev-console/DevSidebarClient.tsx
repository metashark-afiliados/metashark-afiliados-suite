// src/components/dev-console/DevSidebarClient.tsx
/**
 * @file DevSidebarClient.tsx
 * @description Ensamblador de UI. Ha sido refactorizado a un estándar de élite
 *              para invocar la Server Action de `signOut` a través de un evento
 *              `onClick` con `useTransition`, eliminando la advertencia de JSDOM
 *              y proporcionando un feedback de carga explícito.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";

import { signOutAction } from "@/lib/actions/session.actions";
import { Button } from "@/components/ui/button";
import { NavLink } from "./sidebar/NavLink";
import { RouteTreeViewer, type RouteNode } from "./sidebar/RouteTreeViewer";
import { devConsoleNavLinks } from "./sidebar/sidebar.config";
import { logger } from "@/lib/logging";

export function DevSidebarClient() {
  const t = useTranslations("components.dev-console.DevSidebar");
  const [routes, setRoutes] = useState<RouteNode | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(() => {
      signOutAction();
    });
  };

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
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
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
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleSignOut}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          {t("signOut")}
        </Button>
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
 * 1. **Robustez en Entorno de Pruebas**: ((Implementada)) Se ha eliminado el uso de `<form action={...}>`, lo que erradica la advertencia de React en JSDOM.
 * 2. **Feedback de Usuario de Élite**: ((Implementada)) El uso de `useTransition` permite mostrar un estado de carga (`Loader2`) y deshabilitar el botón durante el proceso de cierre de sesión, mejorando la UX.
 *
 * @subsection Melhorias Futuras
 * 1. **Confirmación de Cierre de Sesión**: ((Vigente)) Para una UX más segura, se podría abrir un pequeño diálogo de confirmación (`ConfirmationDialog`) antes de invocar la `signOutAction`.
 *
 * =====================================================================
 */
// src/components/dev-console/DevSidebarClient.tsx
