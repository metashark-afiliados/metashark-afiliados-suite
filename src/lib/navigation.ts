// src/lib/navigation.ts
/**
 * @file src/lib/navigation.ts
 * @description Manifiesto de Enrutamiento y SSoT. Define todas las rutas de la
 *              aplicación, la configuración de i18n, y exporta los componentes
 *              y hooks de navegación tipo-seguros.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 9.1.0
 * @see .docs-espejo/lib/navigation.ts.md
 */
import {
  createLocalizedPathnamesNavigation,
  type Pathnames,
} from "next-intl/navigation";

export const locales = ["en-US", "es-ES", "pt-BR"] as const;
export type AppLocale = (typeof locales)[number];
export const localePrefix = "as-needed";

/**
 * @public
 * @constant pathnames
 * @description El registro canónico de todas las rutas de la aplicación.
 *              La clave es la ruta canónica y el valor es la plantilla de la URL.
 */
export const pathnames = {
  // --- Rutas Públicas y de Marketing ---
  "/": "/",
  "/about": "/about",
  "/blog": "/blog",
  "/contact": "/contact",
  "/pricing": "/pricing",

  // --- Rutas de Autenticación ---
  "/login": "/login",
  "/signup": "/signup",
  "/forgot-password": "/forgot-password",
  "/reset-password": "/reset-password",
  "/auth-notice": "/auth-notice",

  // --- Rutas de Onboarding y Configuración Inicial ---
  "/welcome": "/welcome",
  "/choose-language": "/choose-language",

  // --- Ecosistema del Dashboard (Protegido) ---
  "/dashboard": "/dashboard",
  "/dashboard/projects": "/dashboard/projects", // <-- RUTA AÑADIDA
  "/dashboard/sites": "/dashboard/sites",
  "/dashboard/sites/[siteId]/campaigns": "/dashboard/sites/[siteId]/campaigns",
  "/dashboard/templates": "/dashboard/templates",
  "/dashboard/brand": "/dashboard/brand",
  "/dashboard/settings": "/dashboard/settings",
  "/dashboard/resources/icons": "/dashboard/resources/icons",

  // --- Constructor (Protegido) ---
  "/builder/new": "/builder/new",
  "/builder/[creationId]": "/builder/[creationId]",

  // --- Rutas Legales ---
  "/cookies": "/cookies",
  "/disclaimer": "/disclaimer",
  "/legal": "/legal",
  "/privacy": "/privacy",
  "/terms": "/terms",

  // --- Rutas de Soporte y Ayuda ---
  "/support": "/support",
  "/docs": "/docs",
  "/wiki": "/wiki",

  // --- Consola de Desarrollo (Protegida, Rol Específico) ---
  "/dev-console": "/dev-console",
  "/dev-console/campaigns": "/dev-console/campaigns",
  "/dev-console/logs": "/dev-console/logs",
  "/dev-console/telemetry": "/dev-console/telemetry",
  "/dev-console/users": "/dev-console/users",

  // --- Rutas Especiales y de Sistema ---
  "/unauthorized": "/unauthorized",
  "/sentry-example-page": "/sentry-example-page",
} satisfies Pathnames<typeof locales>;

/**
 * @public
 * @description Utilitarios de navegación tipo-seguros generados por `next-intl`.
 *              Esta es la SSoT para toda la navegación del lado del cliente.
 */
export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });

type PathnameKeys = keyof typeof pathnames;

/**
 * @public
 * @typedef Route
 * @description Un tipo robusto para las rutas de la aplicación. Garantiza que solo
 *              rutas válidas del manifiesto `pathnames` puedan ser utilizadas.
 */
export type Route =
  | PathnameKeys
  | {
      pathname: PathnameKeys;
      params?: Record<string, string | number>;
    };
// src/lib/navigation.ts
