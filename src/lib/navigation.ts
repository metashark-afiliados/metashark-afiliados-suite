// src/lib/navigation.ts
/**
 * @file src/lib/navigation.ts
 * @description Manifiesto de Enrutamiento y SSoT. Sincronizado para incluir
 *              las nuevas rutas del "Workspace Creativo".
 * @author Raz Podestá - MetaShark Tech
 * @version 8.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from "next-intl/navigation";

export const locales = ["en-US", "es-ES", "pt-BR"] as const;
export type AppLocale = (typeof locales)[number];
export const localePrefix = "as-needed";

export const pathnames = {
  "/": "/",
  "/login": "/login",
  "/signup": "/signup",
  "/about": "/about",
  "/admin": "/admin",
  "/blog": "/blog",
  "/builder/[creationId]": "/builder/[creationId]",
  "/choose-language": "/choose-language",
  "/contact": "/contact",
  "/cookies": "/cookies",
  "/dashboard": "/dashboard",
  // --- INICIO DE SINCRONIZACIÓN DE RUTAS ---
  "/dashboard/projects": "/dashboard/projects",
  "/dashboard/templates": "/dashboard/templates",
  "/dashboard/brand": "/dashboard/brand",
  // --- FIN DE SINCRONIZACIÓN DE RUTAS ---
  "/dashboard/settings": "/dashboard/settings",
  "/dashboard/sites": "/dashboard/sites",
  "/dashboard/sites/[siteId]/campaigns": "/dashboard/sites/[siteId]/campaigns",
  "/dev-console": "/dev-console",
  "/dev-console/campaigns": "/dev-console/campaigns",
  "/dev-console/logs": "/dev-console/logs",
  "/dev-console/sentry-test": "/dev-console/sentry-test",
  "/dev-console/telemetry": "/dev-console/telemetry",
  "/dev-console/users": "/dev-console/users",
  "/disclaimer": "/disclaimer",
  "/docs": "/docs",
  "/forgot-password": "/forgot-password",
  "/gallery/bridgepages": "/gallery/bridgepages",
  "/gallery/landings": "/gallery/landings",
  "/legal": "/legal",
  "/lia-chat": "/lia-chat",
  "/privacy": "/privacy",
  "/pricing": "/pricing",
  "/reset-password": "/reset-password",
  "/support": "/support",
  "/terms": "/terms",
  "/unauthorized": "/unauthorized",
  "/wiki": "/wiki",
  "/auth-notice": "/auth-notice",
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });

type PathnameKeys = keyof typeof pathnames;

export type Route =
  | PathnameKeys
  | {
      pathname: PathnameKeys;
      params?: Record<string, string | number>;
    };
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de SSoT**: ((Implementada)) Se han añadido las nuevas rutas del "Workspace Creativo" al manifiesto, expandiendo el tipo `Route` y resolviendo el error de compilación.
 *
 * =====================================================================
 */
// src/lib/navigation.ts
