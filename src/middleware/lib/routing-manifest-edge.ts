// src/middleware/lib/routing-manifest-edge.ts
/**
 * @file src/middleware/lib/routing-manifest-edge.ts
 * @description Manifiesto de Seguridad Declarativo para el Edge. Esta es la
 *              Única Fuente de Verdad para todas las reglas de seguridad de
 *              enrutamiento consumidas por el middleware.
 * @author Raz Podestá - MetaShark Tech
 * @copilot RaZ WriTe
 * @version 4.0.0
 * @see .docs-espejo/middleware/lib/routing-manifest-edge.ts.md
 */
import "server-only";

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
  // --- Rutas de Máxima Restricción ---
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
  // --- Rutas Protegidas Generales ---
  { path: "/dashboard", classification: "protected" },
  { path: "/builder", classification: "protected" },
  { path: "/unauthorized", classification: "protected" },
  // --- Rutas de Autenticación ---
  { path: "/login", classification: "auth" },
  { path: "/signup", classification: "auth" },
  { path: "/forgot-password", classification: "auth" },
  { path: "/reset-password", classification: "auth" },
  // --- Ruta Pública Principal ---
  { path: "/", classification: "public" },
];
// src/middleware/lib/routing-manifest-edge.ts
