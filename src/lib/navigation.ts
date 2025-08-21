// src/lib/navigation.ts
/**
 * @file src/lib/navigation.ts
 * @description Manifiesto de Enrutamiento. Corregido para restaurar la
 *              exportación del tipo `Route`, resolviendo una desincronización
 *              de contrato que afectaba a componentes de UI.
 * @author Raz Podestá
 * @version 5.1.0
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
  "/about": "/about",
  "/admin": "/admin",
  "/auth/login": "/auth/login",
  "/auth/signup": "/auth/signup",
  "/blog": "/blog",
  "/builder/[campaignId]": "/builder/[campaignId]",
  "/choose-language": "/choose-language",
  "/contact": "/contact",
  "/cookies": "/cookies",
  "/dashboard": "/dashboard",
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
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });

type PathnameKeys = keyof typeof pathnames;

// Se restaura el nombre del tipo `Route` que los componentes de UI esperan.
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
 * 1. **Sincronización de Contrato**: ((Implementada)) El tipo `AppPathname` ha sido renombrado de vuelta a `Route`, resolviendo la causa raíz del error `TS2305` en los componentes consumidores.
 *
 * =====================================================================
 */
// src/lib/navigation.ts
