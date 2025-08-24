// src/lib/types/database/tables/campaigns.ts
/**
 * @file campaigns.ts
 * @description Define el contrato de datos atómico para la tabla `campaigns`.
 *              Nivelado a un estándar de élite para alinear la nulabilidad de
 *              `site_id` con la lógica de negocio de campañas "huérfanas".
 * @author Raz Podestá
 * @version 3.0.0
 */
import { type Json } from "../_shared";
import { type Enums } from "../enums";

export type Campaigns = {
  Row: {
    content: Json | null;
    created_at: string;
    created_by: string | null; // Añadido para consistencia con schema
    id: string;
    name: string;
    site_id: string | null; // <-- CORRECCIÓN: Permitir null
    slug: string; // <-- CORRECCIÓN: No nullable según schema
    updated_at: string | null;
    affiliate_url: string | null;
    status: Enums["campaign_status"];
  };
  Insert: {
    content?: Json | null;
    created_at?: string;
    created_by?: string | null; // Añadido para consistencia
    id?: string;
    name: string;
    site_id?: string | null; // <-- CORRECCIÓN: Permitir null
    slug: string; // <-- CORRECCIÓN: Requerido
    updated_at?: string | null;
    affiliate_url?: string | null;
    status?: Enums["campaign_status"];
  };
  Update: {
    content?: Json | null;
    created_at?: string;
    created_by?: string | null;
    id?: string;
    name?: string;
    site_id?: string | null; // <-- CORRECCIÓN: Permitir null
    slug?: string;
    updated_at?: string | null;
    affiliate_url?: string | null;
    status?: Enums["campaign_status"];
  };
  Relationships: [
    {
      foreignKeyName: "campaigns_created_by_fkey";
      columns: ["created_by"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "campaigns_site_id_fkey";
      columns: ["site_id"];
      isOneToOne: false;
      referencedRelation: "sites";
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
 * 1. **Sincronización de Nulabilidad**: ((Implementada)) El campo `site_id` ahora es `string | null` en todos los tipos (`Row`, `Insert`, `Update`), alineándose con la arquitectura de campañas "huérfanas" y resolviendo el error `TS2322`.
 * 2. **Sincronización de Esquema Completa**: ((Implementada)) Se han añadido las propiedades `created_by` y las relaciones faltantes, y se ha corregido la nulabilidad de `slug` para que el tipo sea un espejo 1:1 del `schema.sql`.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Fuerte para `content`**: ((Vigente)) Reemplazar el tipo `Json` con un tipo inferido de un `CampaignConfigSchema` de Zod.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/campaigns.ts
