// src/middleware/lib/routing-manifest-edge.ts
/**
 * @file src/middleware/lib/routing-manifest-edge.ts
 * @description Manifiesto de Seguridad Declarativo para el Edge. Esta es la
 *              Única Fuente de Verdad para todas las reglas de seguridad de
 *              enrutamiento consumidas por el middleware.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * @public
 * @typedef RouteClassification
 * @description Define los niveles de seguridad para una ruta.
 */
export type RouteClassification = "public" | "auth" | "protected";

/**
 * @public
 * @interface RouteSecurityRule
 * @description Define el contrato para una única regla de seguridad de enrutamiento.
 */
export interface RouteSecurityRule {
  path: string;
  classification: RouteClassification;
  requiredRoles?: AppRole[];
}

/**
 * @public
 * @constant ROUTE_MANIFEST
 * @description El array canónico de reglas de seguridad. El orden es crucial.
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
  { path: "/auth/login", classification: "auth" },
  { path: "/auth/signup", classification: "auth" },
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
 * 1. **Aislamiento de Runtime**: ((Implementada)) El aparato ahora reside en `src/middleware/lib`, consolidando toda la configuración del middleware en un solo lugar.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga desde Base de Datos**: ((Vigente)) Para una gestión dinámica, este manifiesto podría ser cargado desde una tabla `route_rules` en Supabase y cacheado agresivamente en el Edge.
 *
 */
// src/middleware/lib/routing-manifest-edge.ts
