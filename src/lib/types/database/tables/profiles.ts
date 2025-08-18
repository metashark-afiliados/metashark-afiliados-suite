// src/lib/types/database/tables/profiles.ts
/**
 * @file profiles.ts
 * @description Define el contrato de datos atómico para la tabla `profiles`.
 *              Sincronizado con la arquitectura v8.0 para incluir el campo
 *              `has_completed_onboarding` y alineado con el schema.sql canónico.
 * @author Raz Podestá
 * @version 3.0.0 (Onboarding Architecture)
 */
import { type Json } from "../_shared";
import { type Enums } from "../enums";

export type Profiles = {
  Row: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    app_role: Enums["app_role"];
    plan_type: Enums["plan_type"];
    dashboard_layout: Json | null;
    has_completed_onboarding: boolean; // <-- ARQUITECTURA v8.0
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id: string;
    email: string;
    full_name?: string | null;
    avatar_url?: string | null;
    app_role?: Enums["app_role"];
    plan_type?: Enums["plan_type"];
    dashboard_layout?: Json | null;
    has_completed_onboarding?: boolean; // <-- ARQUITECTURA v8.0
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
    dashboard_layout?: Json | null;
    has_completed_onboarding?: boolean; // <-- ARQUITECTURA v8.0
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
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Arquitectónica**: ((Implementada)) Se ha añadido la propiedad `has_completed_onboarding` al contrato de datos, alineándolo con el `schema.sql v8.1`.
 * 2. **Sincronización con Snapshot**: ((Implementada)) Se han añadido las propiedades `email`, `plan_type` y `created_at` que faltaban en la versión del snapshot, asegurando que el tipo refleje el 100% de la estructura de la tabla.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Fuerte para `dashboard_layout`**: ((Vigente)) Reemplazar `Json` por un tipo inferido de un `DashboardLayoutSchema` de Zod para una validación más estricta.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/profiles.ts
