// src/lib/data/campaigns/types.ts
/**
 * @file src/lib/data/campaigns/types.ts
 * @description Tipos de datos compartidos para los módulos de campañas. Ha sido
 *              extendido para incluir `CampaignSiteInfo`, el contrato de datos
 *              para verificaciones de permisos.
 * @author Raz Podestá
 * @version 2.0.0
 * @date 2025-08-27
 */
import { type Tables } from "@/lib/types/database";

export type CampaignMetadata = Pick<
  Tables<"campaigns">,
  | "id"
  | "site_id"
  | "name"
  | "slug"
  | "status"
  | "created_at"
  | "updated_at"
  | "affiliate_url"
>;

export type CampaignWithContent = Tables<"campaigns"> & {
  sites: { workspace_id: string; subdomain: string | null } | null;
};

/**
 * @public
 * @typedef CampaignSiteInfo
 * @description Contrato de datos optimizado que contiene la información mínima
 *              necesaria para validar los permisos de una campaña: su `site_id` y
 *              el `workspace_id` del sitio al que pertenece.
 */
export type CampaignSiteInfo = {
  site_id: string | null;
  workspace_id: string;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Contrato de Permisos Explícito**: Se ha añadido el tipo `CampaignSiteInfo`. Esto crea un contrato de datos claro y tipo-seguro para la comunicación entre la capa de datos y la capa de seguridad, mejorando la robustez del sistema.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Tipos Derivados de Zod**: Para una seguridad de tipos de élite, todos los tipos en este archivo podrían ser inferidos a partir de schemas de Zod, garantizando que el contrato de tiempo de ejecución y el contrato de tiempo de compilación estén siempre sincronizados.
 *
 * =====================================================================
 */
// src/lib/data/campaigns/types.ts
