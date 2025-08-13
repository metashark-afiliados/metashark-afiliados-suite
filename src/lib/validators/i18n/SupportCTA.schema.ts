// src/lib/validators/i18n/SupportCTA.schema.ts
/**
 * @file src/lib/validators/i18n/SupportCTA.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'SupportCTA'.
 *              Valida el contenido para la sección de Llamada a la Acción de Soporte.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant SupportCTASchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones de la sección de Llamada a la Acción de Soporte.
 */
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Completitud de Contrato**: ((Implementada)) Se ha creado este schema que faltaba, avanzando en la reconstrucción del contrato de i18n.
 * 2. **Atomicidad (IMAS)**: ((Implementada)) Schema aislado para su namespace, cumpliendo con la arquitectura.
 *
 * @subsection Melhorias Futuras
 * 1. **Enlaces Dinámicos**: ((Vigente)) El schema podría ser extendido para incluir las URLs de los botones (`contactButtonHref`, `docsButtonHref`) si estas necesitaran ser gestionadas desde el archivo de mensajes.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SupportCTA.schema.ts
