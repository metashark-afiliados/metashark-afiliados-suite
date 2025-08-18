// src/lib/types/database/tables/feature_modules.ts
/**
 * @file feature_modules.ts
 * @description Define el contrato de datos atómico para la tabla `feature_modules`.
 *              Esta tabla define los módulos de funcionalidad disponibles en la aplicación,
 *              su estado y los planes requeridos para acceder a ellos.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Enums } from "../enums";

export type FeatureModules = {
  Row: {
    id: string; // ej. "sites", "lia-chat"
    title: string;
    description: string;
    tooltip: string | null;
    icon_name: string;
    href: string;
    status: "active" | "soon";
    required_plan: Enums["plan_type"];
    display_order: number;
  };
  Insert: {
    id: string;
    title: string;
    description: string;
    tooltip?: string | null;
    icon_name: string;
    href: string;
    status?: "active" | "soon";
    required_plan?: Enums["plan_type"];
    display_order?: number;
  };
  Update: {
    id?: string;
    title?: string;
    description?: string;
    tooltip?: string | null;
    icon_name?: string;
    href?: string;
    status?: "active" | "soon";
    required_plan?: Enums["plan_type"];
    display_order?: number;
  };
  Relationships: [];
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Módulos de Funcionalidad**: ((Implementada)) Este nuevo contrato de tipos define la SSoT para los módulos del dashboard, resolviendo la desincronización de la capa de datos.
 *
 * @subsection Melhorias Futuras
 * 1. **Relación con Feature Flags**: ((Vigente)) Se podría añadir una columna `feature_flag_name: string | null` para vincular un módulo a un feature flag específico, permitiendo un control de lanzamiento más granular.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/feature_modules.ts