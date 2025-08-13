// src/lib/validators/i18n/LandingsGalleryPage.schema.ts
/**
 * @file LandingsGalleryPage.schema.ts
 * @description Define el contrato de datos para el namespace 'LandingsGalleryPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const LandingsGalleryPageSchema = z.object({
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
// src/lib/validators/i18n/LandingsGalleryPage.schema.ts
