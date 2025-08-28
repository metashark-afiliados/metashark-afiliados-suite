// src/lib/types/database/tables/profiles.ts
/**
 * @file profiles.ts
 * @description Define el contrato de datos atómico para la tabla `profiles`.
 *              Ha sido sincronizado con el `schema.sql` canónico para reintroducir
 *              la propiedad `icon`, resolviendo una desincronización de tipos
 *              y un error de compilación crítico (`TS2353`) en el mock factory.
 * @author Raz Podestá
 * @version 4.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type Json } from "../_shared";
import { type Enums } from "../enums";
// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Importación de Schema de Preferencias ---
import { type DashboardLayoutPreferencesSchema } from "@/lib/validators/schemas";
import { type z } from "zod";
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---

export type Profiles = {
  Row: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    app_role: Enums["app_role"];
    plan_type: Enums["plan_type"];
    /**
     * @property dashboard_layout
     * @description Preferencias de layout y UI del dashboard del usuario,
     *              fuertemente tipadas por `DashboardLayoutPreferencesSchema`.
     */
    dashboard_layout: z.infer<typeof DashboardLayoutPreferencesSchema> | null; // <-- TIPO FUERTE
    has_completed_onboarding: boolean;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    email: string;
    full_name?: string | null;
    avatar_url?: string | null;
    app_role?: Enums["app_role"];
    plan_type?: Enums["plan_type"];
    dashboard_layout?: z.infer<typeof DashboardLayoutPreferencesSchema> | null; // <-- TIPO FUERTE
    has_completed_onboarding?: boolean;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    email?: string;
    full_name?: string | null;
    avatar_url?: string | null;
    app_role?: Enums["app_role"];
    plan_type?: Enums["plan_type"];
    dashboard_layout?: z.infer<typeof DashboardLayoutPreferencesSchema> | null; // <-- TIPO FUERTE
    has_completed_onboarding?: boolean;
    created_at?: string;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "profiles_id_fkey";
      columns: ["id"];
      isOneToOne: true;
      referencedRelation: "users";
      referencedColumns: ["id"];
    },
  ];
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Tipado Estricto para Preferencias de UI**: ((Implementada)) Se ha reemplazado el tipo `Json | null` por `z.infer<typeof DashboardLayoutPreferencesSchema> | null` para la propiedad `dashboard_layout`. Esto resuelve el tipado débil y proporciona seguridad de tipos completa para las preferencias de UI del usuario, un paso crítico para la personalización del dashboard.
 * 2. **Sincronización Arquitectónica**: ((Implementada)) Este cambio alinea el contrato de tipos de la base de datos con el esquema de validación Zod, asegurando una única fuente de verdad para la estructura de las preferencias de usuario.
 * 3. **Habilitación de Personalización de UI**: ((Implementada)) La tipificación estricta de `dashboard_layout` permite que los hooks y componentes de UI lean y escriban las preferencias (como la librería de iconos activa o el estado de la barra lateral) de forma tipo-segura, sentando las bases para una UI altamente personalizable.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Migraciones de Esquema de Preferencias**: ((Vigente)) Si la estructura de `DashboardLayoutPreferencesSchema` evoluciona en el futuro, será necesario implementar una lógica de migración para las preferencias existentes en la base de datos, quizás a través de una función RPC de PostgreSQL o en la capa de datos.
 * 2. **Valores por Defecto en la Base de Datos**: ((Vigente)) Los valores por defecto para `isSidebarCollapsed` y `activeIconLibraryId` están definidos en el esquema Zod. Idealmente, estos valores por defecto deberían replicarse en la definición de la columna `dashboard_layout` en `src/db/schema.sql` (si PostgreSQL soporta valores por defecto para JSONB anidados, o a través de un trigger `BEFORE INSERT`).
 *
 * =====================================================================
 */
// src/lib/types/database/tables/profiles.ts
