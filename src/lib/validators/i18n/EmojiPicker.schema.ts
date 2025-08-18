// src/lib/validators/i18n/EmojiPicker.schema.ts
/**
 * @file EmojiPicker.schema.ts
 * @description Define el contrato de datos para el namespace 'EmojiPicker'.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const EmojiPickerSchema = z.object({
  no_emoji_found: z.string(),
  select_an_emoji: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Nuevo Schema Atómico**: ((Implementada)) Se ha creado este nuevo schema Zod para el namespace `EmojiPicker`, siguiendo la arquitectura IMAS y proporcionando tipado estricto para todas sus claves de traducción.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/EmojiPicker.schema.ts
