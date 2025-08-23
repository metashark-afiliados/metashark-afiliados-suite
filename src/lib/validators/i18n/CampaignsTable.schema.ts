// src/lib/validators/i18n/CampaignsTable.schema.ts
/**
 * @file CampaignsTable.schema.ts
 * @description Define el contrato de datos para el namespace 'app.dev-console.CampaignsTable'.
 *              Este aparato atómico de validación es consumido por la infraestructura
 *              de i18n para garantizar la seguridad de tipos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const CampaignsTableSchema = z.object({
  title: z.string(),
  description: z.string(),
  error_title: z.string(),
  error_description: z.string(),
  header_name: z.string(),
  header_site: z.string(),
  header_created: z.string(),
  header_updated: z.string(),
  header_actions: z.string(),
  action_view_json: z.string(),
  dialog_title: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve una dependencia crítica para el ensamblador `i18n.schema.ts`, un paso fundamental para estabilizar el sistema de tipos de i18n.
 * 2. **Atomicidad de Contrato**: ((Implementada)) El schema se enfoca únicamente en su namespace, adhiriéndose a la arquitectura IMAS.
 *
 * @subsection Melhorias Futuras
 * 1. **Descripciones Detalladas**: ((Vigente)) Añadir `.describe()` a cada propiedad para proporcionar contexto a los traductores sobre el propósito y la ubicación de cada texto en la UI.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/CampaignsTable.schema.ts
