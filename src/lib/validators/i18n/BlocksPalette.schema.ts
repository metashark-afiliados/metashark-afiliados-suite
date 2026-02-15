// src/lib/validators/i18n/BlocksPalette.schema.ts
/**
 * @file BlocksPalette.schema.ts
 * @description Define el contrato de datos para el namespace 'components.builder.BlocksPalette'.
 *              Sincronizado para incluir la clave de nombre para el bloque `Hero1`.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { z } from "zod";

export const BlocksPaletteSchema = z.object({
  title: z.string(),
  unknown_block_preview: z.string(),
  block_name_Header1: z.string(),
  block_name_Hero1: z.string(), // <-- SINCRONIZADO
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integridad de Contrato**: ((Implementada)) El schema Zod ahora refleja con precisión la estructura del archivo de mensajes correspondiente, previniendo errores de validación de i18n y `MISSING_MESSAGE` en tiempo de ejecución.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Dinámica de Claves**: ((Vigente)) Las claves `block_name_*` están codificadas. Un sistema de élite podría generar estas claves dinámicamente a partir de un registro de bloques para garantizar que siempre estén sincronizadas.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/BlocksPalette.schema.ts
