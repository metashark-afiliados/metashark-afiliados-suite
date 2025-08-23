// src/lib/validators/i18n/IconGalleryPage.schema.ts
/**
 * @file IconGalleryPage.schema.ts
 * @description Define el contrato de datos para el namespace 'pages.IconGalleryPage'.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const IconGalleryPageSchema = z.object({
  metadataTitle: z.string(),
  pageTitle: z.string(),
  pageDescription: z.string(),
  searchPlaceholder: z.string(),
  clearSearchAriaLabel: z.string(),
  noResults: z.string(),
  copySuccessMessage: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve la última dependencia crítica reportada para la infraestructura de i18n.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/IconGalleryPage.schema.ts
