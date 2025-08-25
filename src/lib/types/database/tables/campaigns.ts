/**
 * @file campaigns.ts
 * @description Define el contrato de datos atómico para la tabla `campaigns`.
 *              Ha sido refactorizado a un estándar de élite para alinear su
 *              contrato con la lógica de negocio de "Creaciones Soberanas",
 *              permitiendo que `site_id` sea nulo.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type Enums } from "../enums";

export type Campaigns = {
  Row: {
    id: string;
    creation_id: string;
    // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
    site_id: string | null;
    // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
    name: string;
    slug: string;
    status: Enums["campaign_status"];
    affiliate_url: string | null;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    creation_id: string;
    // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
    site_id: string | null;
    // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
    name: string;
    slug: string;
    status?: Enums["campaign_status"];
    affiliate_url?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    slug?: string;
    status?: Enums["campaign_status"];
    affiliate_url?: string | null;
    updated_at?: string | null;
    // La actualización de site_id se maneja a través de una acción específica
  };
  Relationships: [
    {
      foreignKeyName: "campaigns_creation_id_fkey";
      columns: ["creation_id"];
      isOneToOne: false;
      referencedRelation: "creations";
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
 * 1. **Alineación Arquitectónica (TS2322)**: ((Implementada)) Se ha modificado `site_id` para que sea `string | null` en los tipos `Row` e `Insert`. Esto alinea el contrato de datos con la lógica de negocio que permite la existencia de campañas soberanas (no asignadas a un sitio), resolviendo la causa raíz del error de tipo en los helpers y actions.
 *
 * @subsection Melhorias Futuras
 * 1. **Relación con `created_by`**: ((Vigente)) Para una integridad referencial completa, se debería añadir la relación `created_by` a la tabla `profiles` en la sección `Relationships`.
 *
 * =====================================================================
 */
