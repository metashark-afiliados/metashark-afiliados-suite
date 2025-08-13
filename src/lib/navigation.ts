// src/lib/navigation.ts
/**
 * @file src/lib/navigation.ts
 * @description Manifiesto de Enrutamiento y Contrato de Navegación de Élite.
 *              Ha sido actualizado para incluir todas las rutas estáticas
 *              de la nueva `HomePage`, resolviendo errores de tipo en toda la aplicación.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from "next-intl/navigation";

export const locales = ["en-US", "es-ES", "pt-BR"] as const;
export type AppLocale = (typeof locales)[number];
export const localePrefix = "as-needed";

// --- INICIO DE SINCRONIZACIÓN DE MANIFIESTO ---
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
  "/docs": "/docs", // <-- RUTA AÑADIDA
  "/forgot-password": "/forgot-password",
  "/gallery/bridgepages": "/gallery/bridgepages",
  "/gallery/landings": "/gallery/landings",
  "/legal": "/legal",
  "/lia-chat": "/lia-chat",
  "/privacy": "/privacy",
  "/pricing": "/pricing", // <-- RUTA AÑADIDA
  "/reset-password": "/reset-password",
  "/support": "/support", // <-- RUTA AÑADIDA
  "/terms": "/terms",
  "/unauthorized": "/unauthorized",
  "/welcome": "/welcome",
  "/wiki": "/wiki",
} satisfies Pathnames<typeof locales>;
// --- FIN DE SINCRONIZACIÓN DE MANIFIESTO ---

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });

type PathnameKeys = keyof typeof pathnames;

export type AppPathname =
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
 * 1. **Sincronización de Rutas**: ((Implementada)) Se han añadido las rutas `/docs`, `/support` y `/pricing` al manifiesto `pathnames`. Esto sincroniza el contrato de tipos de navegación con los componentes que las usan, resolviendo el error `TS2322`.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática de Rutas**: ((Vigente)) La gestión manual de `pathnames` es propensa a errores. La mejora de élite sigue siendo la refactorización del script `generate-routes-manifest.mjs` para que genere este objeto y el tipo `AppPathname` automáticamente.
 *
 * =====================================================================
 */
// src/lib/navigation.ts
