// src/lib/validators/i18n/SupportCTA.schema.ts
/**
 * @file SupportCTA.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'SupportCTA'
 *              dentro de `landing.json`. Valida el contenido para la sección de
 *              Llamada a la Acción de Soporte.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

export const SupportCTASchema = z.object({
  /** Título principal de la sección. */
  title: z.string(),
  /** Descripción o texto de apoyo de la sección. */
  description: z.string(),
  /** Texto para el botón de contacto primario. */
  contactButtonText: z.string(),
  /** Texto para el botón secundario de documentación. */
  docsButtonText: z.string(),
});
// src/lib/validators/i18n/SupportCTA.schema.ts
