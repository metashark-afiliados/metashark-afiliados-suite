// src/lib/validators/i18n/BridgepagesGalleryPage.schema.ts
/**
 * @file BridgepagesGalleryPage.schema.ts
 * @description Define el contrato de datos para el namespace 'BridgepagesGalleryPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const BridgepagesGalleryPageSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/BridgepagesGalleryPage.schema.ts
