// src/components/dev-console/DevSidebarClient.tsx
/**
 * @file DevSidebarClient.tsx
 * @description Ensamblador de UI. Ha sido refactorizado a un estándar de élite
 *              para invocar la Server Action de `signOut` a través de un evento
 *              `onClick` con `useTransition` y para alinear el logging con la
 *              Constitución.
 * @author L.I.A. Legacy
 * @version 5.0.0
 * @see .docs-espejo/components/dev-console/DevSidebarClient.tsx.md
 */
"use client";

import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/session.actions";
import { logger } from "@/lib/logger";
import { NavLink } from "./sidebar/NavLink";
import { RouteTreeViewer, type RouteNode } from "./sidebar/RouteTreeViewer";
import { devConsoleNavLinks } from "./sidebar/sidebar.config";

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
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(setRoutes)
      .catch((error) =>
        logger.warn(
          { err: error },
          "[DevSidebarClient] Could not load routes manifest."
        )
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
// src/components/dev-console/DevSidebarClient.tsx