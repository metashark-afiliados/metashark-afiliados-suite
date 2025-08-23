// src/lib/validators/i18n/Canvas.schema.ts
/**
 * @file Canvas.schema.ts
 * @description Define el contrato de datos para el namespace 'components.builder.Canvas'.
 *              Este aparato atómico de validación es consumido por la infraestructura
 *              de i18n para garantizar la seguridad de tipos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const CanvasSchema = z.object({
  loading_config: z.string(),
  empty_canvas: z.object({
    title: z.string(),
    description: z.string(),
  }),
  unknown_block_error: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve otra dependencia faltante para el ensamblador `i18n.schema.ts`.
 * 2. **Atomicidad de Contrato**: ((Implementada)) El schema se enfoca únicamente en su namespace, adhiriéndose a la arquitectura IMAS.
 *
 * @subsection Melhorias Futuras
 * 1. **Descripciones Detalladas**: ((Vigente)) Añadir `.describe()` a cada propiedad para proporcionar contexto a los traductores.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/Canvas.schema.ts
