// src/middleware/lib/routing-manifest-edge.ts
/**
 * @file src/middleware/lib/routing-manifest-edge.ts
 * @description Manifiesto de Seguridad Declarativo para el Edge.
 *              ¡ADVERTENCIA! Esta versión ha sido modificada temporalmente para
 *              clasificar todas las rutas como 'public', deshabilitando
 *              efectivamente todos los chequeos de seguridad para fines de depuración.
 * @author L.I.A. Legacy
 * @version 2.1.0 (Temporarily Unsecured)
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
  // --- INICIO DE MODIFICACIÓN DE SEGURIDAD ---
  // Todas las rutas se clasifican como 'public' para deshabilitar la autenticación.
  {
    path: "/dev-console",
    classification: "public",
    requiredRoles: ["developer"],
  },
  {
    path: "/admin",
    classification: "public",
    requiredRoles: ["admin", "developer"],
  },
  { path: "/dashboard", classification: "public" },
  { path: "/builder", classification: "public" },
  { path: "/welcome", classification: "public" },
  { path: "/unauthorized", classification: "public" },
  { path: "/login", classification: "public" },
  { path: "/signup", classification: "public" },
  { path: "/forgot-password", classification: "public" },
  { path: "/reset-password", classification: "public" },
  { path: "/", classification: "public" },
  // --- FIN DE MODIFICACIÓN DE SEGURIDAD ---
];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Navegación Desbloqueada**: ((Implementada)) Cumple con la directiva de desproteger todas las rutas para facilitar la depuración.
 *
 * @subsection Melhorias Futuras
 * 1. **Variable de Entorno para Bypass**: ((Vigente)) Una estrategia de élite a largo plazo sería añadir una variable de entorno `BYPASS_AUTH_MIDDLEWARE=true`. El `Auth Handler` leería esta variable y, si es verdadera, se saltaría todos los chequeos, evitando la necesidad de modificar el código fuente.
 *
 * =====================================================================
 */
// src/middleware/lib/rout
