// src/lib/routing-manifest.ts
/**
 * @file routing-manifest.ts
 * @description Manifiesto de Seguridad Declarativo. Sincronizado para utilizar
 *              la nueva nomenclatura de ruta del constructor, resolviendo un
 *              conflicto de enrutamiento.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

export type RouteClassification = "public" | "auth" | "protected";

export interface RouteSecurityRule {
  path: string;
  classification: RouteClassification;
  requiredRoles?: AppRole[];
}

export const ROUTE_MANIFEST: RouteSecurityRule[] = [
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
  // --- INICIO DE CORRECCIÓN ---
  { path: "/builder", classification: "protected" },
  // --- FIN DE CORRECCIÓN ---
  { path: "/dashboard", classification: "protected" },
  { path: "/welcome", classification: "protected" },
  { path: "/unauthorized", classification: "protected" },
  { path: "/login", classification: "auth" },
  { path: "/signup", classification: "auth" },
  { path: "/forgot-password", classification: "auth" },
  { path: "/reset-password", classification: "auth" },
  { path: "/", classification: "public" },
];
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Conflicto de Rutas**: ((Implementada)) Se ha actualizado la ruta del constructor para que utilice la base `/builder` sin el parámetro dinámico, ya que el middleware de seguridad solo necesita proteger el segmento base. La nomenclatura específica del parámetro (`creationId`) ahora reside únicamente en el manifiesto de `next-intl`.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga desde Base de Datos**: ((Vigente)) Para una gestión dinámica, este manifiesto podría ser cargado desde una tabla `route_rules` y cacheado en el Edge.
 *
 * =====================================================================
 */
// src/lib/routing-manifest.ts
