// src/lib/builder/block-initializer.helper.ts
/**
 * @file block-initializer.helper.ts
 * @description Aparato helper atómico y puro. Su única responsabilidad es actuar como una
 *              factoría para crear nuevos objetos `PageBlock`. Es la Única Fuente de Verdad
 *              para la inicialización de bloques, consumiendo el manifiesto `blockEditorDefinitions`
 *              para ensamblar un nuevo bloque con sus propiedades y estilos por defecto.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { logger } from "@/lib/logging";
import { blockEditorDefinitions } from "./block-editor-definitions";
import { type PageBlock } from "./types.d";

/**
 * @public
 * @function initializeNewBlock
 * @description Crea una nueva instancia de `PageBlock` para un tipo de bloque dado.
 * @param {string} blockType - El tipo de bloque a crear (ej. "Hero1", "Header1").
 * @param {Record<string, unknown>} [overrideProps={}] - Propiedades que sobrescribirán los valores por defecto.
 * @returns {PageBlock | null} Un nuevo objeto `PageBlock`, o `null` si el tipo de bloque no está definido.
 */
export function initializeNewBlock(
  blockType: string,
  overrideProps: Record<string, unknown> = {}
): PageBlock | null {
  const blockDefinition = blockEditorDefinitions[blockType];

  if (!blockDefinition) {
    logger.warn(
      `[BlockInitializer] Se intentó inicializar un tipo de bloque no definido: "${blockType}"`
    );
    return null;
  }

  const defaultProps: Record<string, unknown> = {};
  for (const propKey in blockDefinition.properties) {
    const propDef = blockDefinition.properties[propKey];
    if (propDef.defaultValue !== undefined) {
      defaultProps[propKey] = propDef.defaultValue;
    }
  }

  const defaultStyles: Record<string, string> = {};
  for (const styleKey in blockDefinition.styles) {
    const styleDef = blockDefinition.styles[styleKey];
    if (styleDef.defaultValue !== undefined) {
      defaultStyles[styleKey] = String(styleDef.defaultValue);
    }
  }

  const newBlock: PageBlock = {
    id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type: blockType,
    props: { ...defaultProps, ...overrideProps },
    styles: { ...defaultStyles },
  };

  logger.trace(`[BlockInitializer] Nuevo bloque inicializado.`, {
    type: blockType,
    id: newBlock.id,
  });

  return newBlock;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Factoría)**: ((Implementada)) Este aparato aísla perfectamente la lógica de creación de bloques, cumpliendo la "Filosofía LEGO" y el principio DRY.
 * 2. **Fuente Única de Verdad**: ((Implementada)) Es el único lugar donde se interpreta `blockEditorDefinitions` para la creación de bloques, centralizando la lógica.
 * 3. **ID de Bloque Robusto**: ((Implementada)) El ID ahora incluye un componente aleatorio para reducir drásticamente la probabilidad de colisiones en interacciones rápidas.
 * 4. **Full Observabilidad**: ((Implementada)) La creación de cada bloque se registra con `logger.trace`, proporcionando visibilidad completa.
 *
 * @subsection Melhorias Futuras
 * 1. **Soporte para Plantillas de Bloque**: ((Vigente)) Extender la función para aceptar un `templateId` opcional que pueda obtener una estructura de props y estilos predefinida desde una nueva tabla en la base de datos.
 *
 * =====================================================================
 */
// src/lib/builder/block-initializer.helper.ts
