// src/lib/types/database/tables/profiles.ts
/**
 * @file profiles.ts
 * @description Define el contrato de datos atómico y soberano para la tabla `profiles`.
 *              Ha sido refactorizado holísticamente para definir localmente la interfaz
 *              `DashboardLayoutPreferences`, desacoplando la capa de tipos de la base
 *              de datos de la capa de validadores.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 6.0.0
 */
import { type IconLibraryDefinition } from "@/config/icon-libraries.config";
import { type Json } from "../_shared";
import { type Enums } from "../enums";

/**
 * @public
 * @interface DashboardLayoutPreferences
 * @description Contrato de datos y SSoT para las preferencias de UI del usuario.
 *              Define la estructura del objeto JSON almacenado en `profiles.dashboard_layout`.
 */
export interface DashboardLayoutPreferences {
  isSidebarCollapsed: boolean;
  activeIconLibraryId: IconLibraryDefinition["id"];
}

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
     *              fuertemente tipadas por la interfaz `DashboardLayoutPreferences`.
     */
    dashboard_layout: DashboardLayoutPreferences | null;
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
    dashboard_layout?: DashboardLayoutPreferences | null;
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
    dashboard_layout?: DashboardLayoutPreferences | null;
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
// src/lib/types/database/tables/profiles.ts
