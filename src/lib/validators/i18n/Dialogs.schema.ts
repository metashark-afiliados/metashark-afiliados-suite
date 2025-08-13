// src/lib/validators/i18n/Dialogs.schema.ts
/**
 * @file Dialogs.schema.ts
 * @description Define el contrato de datos para el namespace 'Dialogs'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const DialogsSchema = z.object({
  generic_cancelButton: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/Dialogs.schema.ts
