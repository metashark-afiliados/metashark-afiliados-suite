// src/lib/validators/i18n/CommandPalette.schema.ts
/**
 * @file CommandPalette.schema.ts
 * @description Define el contrato de datos para el namespace 'CommandPalette'.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const CommandPaletteSchema = z.object({
  search_placeholder: z.string(),
  empty_results: z.string(),
  navigation_group_heading: z.string(),
  workspaces_group_heading: z.string(),
  search_workspaces_command: z.string(),
  account_group_heading: z.string(),
  my_profile: z.string(),
  my_profile_command_name: z.string(),
  my_profile_command_value: z.string(),
  sign_out: z.string(),
  sign_out_command_name: z.string(),
  sign_out_command_value: z.string(),
  go_to: z.string(),
  switch_to_workspace: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Nuevo Schema Atómico**: ((Implementada)) Se ha creado este nuevo schema Zod para el namespace `CommandPalette`, siguiendo la arquitectura IMAS y proporcionando tipado estricto para todas sus claves de traducción.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/CommandPalette.schema.ts
