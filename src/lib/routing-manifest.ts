// src/lib/routing-manifest.ts
/**
 * @file src/lib/routing-manifest.ts
 * @description Manifiesto de Seguridad Declarativo. Esta es la Única Fuente de Verdad
 *              para todas las reglas de seguridad de enrutamiento de la aplicación.
 *              Refactorizado para alinearse con la arquitectura de "Páginas Dedicadas",
 *              resolviendo la causa raíz del error 404 en las rutas de autenticación.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * @public
 * @typedef RouteClassification
 * @description Define los niveles de seguridad para una ruta.
 *              - `public`: Accesible por todos.
 *              - `auth`: Solo accesible por usuarios NO autenticados (ej. /login).
 *              - `protected`: Requiere una sesión de usuario válida.
 */
export type RouteClassification = "public" | "auth" | "protected";

/**
 * @public
 * @interface RouteSecurityRule
 * @description Define el contrato para una única regla de seguridad de enrutamiento.
 */
export interface RouteSecurityRule {
  /** La ruta base a la que aplica la regla (ej. "/admin"). Se usa `startsWith` para la coincidencia. */
  path: string;
  /** El nivel de clasificación de seguridad para la ruta. */
  classification: RouteClassification;
  /** Un array opcional de roles requeridos si la clasificación es 'protected'. */
  requiredRoles?: AppRole[];
}

/**
 * @public
 * @constant ROUTE_MANIFEST
 * @description El array canónico de reglas de seguridad. El orden es crucial: las
 *              rutas más específicas deben ir primero para asegurar la correcta
 *              coincidencia en la lógica del `find`.
 */
export const ROUTE_MANIFEST: RouteSecurityRule[] = [
  // Rutas de máxima especificidad primero
  {
    path: "/dev-console",
    classification: "protected",
    requiredRoles: ["developer"],
  },
  {
    path: "/admin",
    classification: "protected",
    requiredRoles: ["admin", "developer"],
  },
  // Rutas protegidas generales
  { path: "/dashboard", classification: "protected" },
  { path: "/builder", classification: "protected" },
  { path: "/welcome", classification: "protected" },
  { path: "/unauthorized", classification: "protected" },
  // Rutas de autenticación (solo para no autenticados)
  { path: "/login", classification: "auth" },
  { path: "/signup", classification: "auth" },
  { path: "/forgot-password", classification: "auth" },
  { path: "/reset-password", classification: "auth" },
  // Ruta pública (catch-all) al final
  { path: "/", classification: "public" },
];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error 404**: ((Implementada)) Se han corregido las rutas de `/auth/login` y `/auth/signup` a `/login` y `/signup` respectivamente. Esta es la corrección fundamental que alinea el middleware de seguridad con la estructura de archivos de la aplicación, resolviendo la causa raíz del error 404.
 * 2. **Consolidación de Arquitectura**: ((Implementada)) Este cambio refuerza la arquitectura de "Páginas Dedicadas" como la única SSoT para la autenticación, eliminando la ambigüedad de las rutas antiguas.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga desde Base de Datos**: ((Vigente)) Para una gestión de permisos dinámica sin necesidad de redespliegues, este manifiesto podría ser cargado desde una tabla `route_rules` en Supabase y cacheado agresivamente en el Edge.
 *
 * =====================================================================
 */
// src/lib/routing-manifest.ts
