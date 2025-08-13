/**
 * @file campaigns.ts
 * @description Define el contrato de datos atómico para la tabla `campaigns`.
 *              Nivelado a un estándar de élite para incluir la columna `status`.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { type Json } from "../_shared";
import { type Enums } from "../enums";

export type Campaigns = {
  Row: {
    content: Json | null;
    created_at: string;
    id: string;
    name: string;
    site_id: string;
    slug: string | null;
    updated_at: string | null;
    affiliate_url: string | null;
    status: Enums["campaign_status"];
  };
  Insert: {
    content?: Json | null;
    created_at?: string;
    id?: string;
    name: string;
    site_id: string;
    slug?: string | null;
    updated_at?: string | null;
    affiliate_url?: string | null;
    status?: Enums["campaign_status"];
  };
  Update: {
    content?: Json | null;
    created_at?: string;
    id?: string;
    name?: string;
    site_id?: string;
    slug?: string | null;
    updated_at?: string | null;
    affiliate_url?: string | null;
    status?: Enums["campaign_status"];
  };
  Relationships: [
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
 * 1. **Gestión de Estado**: ((Implementada)) El contrato de datos ahora incluye el campo `status`, sincronizándolo con el esquema de la base de datos. Con la corrección en `enums.ts`, este tipo es ahora válido.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Fuerte para `content`**: ((Vigente)) Reemplazar el tipo `Json` con un tipo inferido de un `CampaignConfigSchema` de Zod.
 *
 * =====================================================================
 */
