// src/lib/validators/i18n/BlocksPalette.schema.ts
/**
 * @file BlocksPalette.schema.ts
 * @description Define el contrato de datos para el namespace 'components.builder.BlocksPalette'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la paleta de bloques del constructor.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const BlocksPaletteSchema = z.object({
  title: z.string(),
  unknown_block_preview: z.string(),
  block_name_Header1: z.string(),
  block_name_Hero1: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve otra dependencia crítica para la infraestructura de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Dinámica de Claves**: ((Vigente)) Las claves `block_name_*` están codificadas. Un sistema de élite podría generar estas claves dinámicamente a partir de un registro de bloques para garantizar que siempre estén sincronizadas.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/BlocksPalette.schema.ts
