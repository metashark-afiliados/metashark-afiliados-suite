// src/lib/navigation.ts
/**
 * @file src/lib/navigation.ts
 * @description Manifiesto de Enrutamiento y SSoT. Sincronizado para eliminar
 *              las rutas obsoletas `/auth/*` y consolidar `/login` y `/signup`
 *              como las únicas rutas canónicas para la autenticación, resolviendo
 *              la desincronización arquitectónica.
 * @author Raz Podestá
 * @version 7.0.0
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
  // --- Rutas de Autenticación Canónicas ---
  "/login": "/login",
  "/signup": "/signup",

  // --- Rutas de Aplicación ---
  "/about": "/about",
  "/admin": "/admin",
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
  "/auth-notice": "/auth-notice", // Ruta para notificaciones post-auth
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
 * 1. **Resolución de Error 404 (Capa de Navegación)**: ((Implementada)) Se han eliminado las rutas obsoletas (`/auth/login`, `/auth/signup`) y se han consolidado las rutas canónicas `/login` y `/signup`. Esto asegura que todos los componentes que consumen el hook `useRouter` o el componente `Link` de este módulo ahora generarán las URLs correctas, eliminando otra causa del error 404.
 * 2. **Consolidación de SSoT**: ((Implementada)) El manifiesto `pathnames` ahora refleja con precisión la arquitectura de rutas de la aplicación, eliminando la deuda técnica y el riesgo de regresión.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática de Manifiesto**: ((Vigente)) Este archivo podría ser generado por un script que escanee la estructura de directorios de `src/app/[locale]` para prevenir futuras desincronizaciones manuales.
 *
 * =====================================================================
 */
// src/lib/navigation.ts
