// src/lib/navigation.ts
/**
 * @file src/lib/navigation.ts
 * @description Manifiesto de Enrutamiento y SSoT. Sincronizado para reflejar la
 *              re-arquitectura del constructor a `[creationId]`, resolviendo un
 *              conflicto de enrutamiento de Next.js.
 * @author Raz Podestá
 * @version 8.0.0
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
  // --- INICIO DE CORRECCIÓN ---
  "/builder/[creationId]": "/builder/[creationId]",
  // --- FIN DE CORRECCIÓN ---
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
 * 1. **Resolución de Error de Arranque**: ((Implementada)) Se ha corregido la definición de la ruta del constructor para que use `[creationId]`, resolviendo el conflicto de enrutamiento que impedía el arranque del servidor.
 *
 * =====================================================================
 */
// src/lib/navigation.ts
