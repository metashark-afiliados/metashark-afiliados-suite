// src/middleware/lib/routing-manifest-edge.ts
/**
 * @file src/middleware/lib/routing-manifest-edge.ts
 * @description Manifiesto de Seguridad Declarativo para el Edge. Esta es la
 *              Única Fuente de Verdad para todas las reglas de seguridad de
 *              enrutamiento consumidas por el middleware.
 * @author L.I.A. Legacy
 * @copilot RaZ WriTe
 * @version 3.0.0
 * @see .docs-espejo/middleware/lib/routing-manifest-edge.ts.md
 */
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * @public
 * @typedef RouteClassification
 * @description Define los niveles de seguridad para una ruta.
 *              - `public`: Accesible para todos.
 *              - `auth`: Solo accesible para usuarios no autenticados (ej. /login).
 *              - `protected`: Requiere autenticación.
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
 * @description El array canónico de reglas de seguridad. El orden es crucial:
 *              las rutas más específicas deben ir antes que las más genéricas.
 */
export const ROUTE_MANIFEST: RouteSecurityRule[] = [
  // --- Rutas de Máxima Restricción (Roles Específicos) ---
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

  // --- Rutas Protegidas Generales (Requieren solo autenticación) ---
  { path: "/dashboard", classification: "protected" },
  { path: "/builder", classification: "protected" },
  { path: "/welcome", classification: "protected" },
  { path: "/unauthorized", classification: "protected" },

  // --- Rutas de Autenticación (Solo para usuarios NO autenticados) ---
  { path: "/login", classification: "auth" },
  { path: "/signup", classification: "auth" },
  { path: "/forgot-password", classification: "auth" },
  { path: "/reset-password", classification: "auth" },

  // --- Ruta Pública Principal (Catch-all para rutas públicas) ---
  { path: "/", classification: "public" },
];
// src/middleware/lib/routing-manifest-edge.ts
