// src/lib/types/database/tables/profiles.ts
/**
 * @file profiles.ts
 * @description Define el contrato de datos atómico para la tabla `profiles`.
 *              Ha sido refactorizado holísticamente para consumir el schema
 *              `DashboardLayoutPreferencesSchema` desde la nueva SSoT
 *              atómica (`@/lib/validators/schemas`), resolviendo el error de
 *              módulo no encontrado (`TS2305`) y aplicando un tipado estricto
 *              a la columna JSONB `dashboard_layout`.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type z } from "zod";

import { type DashboardLayoutPreferencesSchema } from "@/lib/validators/schemas";
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
    /**
     * @property dashboard_layout
     * @description Preferencias de layout y UI del dashboard del usuario,
     *              fuertemente tipadas por `DashboardLayoutPreferencesSchema`.
     */
    dashboard_layout: z.infer<typeof DashboardLayoutPreferencesSchema> | null;
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
    dashboard_layout?: z.infer<typeof DashboardLayoutPreferencesSchema> | null;
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
    dashboard_layout?: z.infer<typeof DashboardLayoutPreferencesSchema> | null;
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
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **`last_active_at` Timestamp**: Añadir un campo `last_active_at: string | null` que se actualice a través de un trigger o middleware en cada petición autenticada. Esto permitiría implementar lógicas de negocio basadas en la actividad del usuario (ej. campañas de re-engagement).
 * 2. **Preferencias de Notificación**: Incluir una columna `notification_preferences: Json | null` y un schema Zod asociado (`NotificationPreferencesSchema`) para permitir a los usuarios controlar qué notificaciones por correo electrónico desean recibir.
 * 3. **Relación con `subscriptions`**: Añadir la relación con la tabla `subscriptions` a la sección `Relationships` para una integridad referencial completa en el sistema de tipos.
 * 4. **Manejo de Zonas Horarias**: Incluir una columna `timezone: string | null` para almacenar la zona horaria del usuario, permitiendo mostrar fechas y horas en su formato local en toda la aplicación.
 * 5. **`user_metadata` JSONB**: Considerar añadir una columna `metadata: Json | null` para almacenar datos de perfil adicionales y no estructurados, proporcionando flexibilidad para futuras características sin necesidad de migraciones de esquema.
 * =====================================================================
 */
// src/lib/types/database/tables/profiles.ts
