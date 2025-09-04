// src/lib/builder/block-initializer.helper.ts
/**
 * @file block-initializer.helper.ts
 * @description Aparato helper atómico y puro. Su única responsabilidad es actuar como una
 *              factoría para crear nuevos objetos `PageBlock`. Es la Única Fuente de Verdad
 *              para la inicialización de bloques, consumiendo el manifiesto `blockEditorDefinitions`
 *              para ensamblar un nuevo bloque con sus propiedades y estilos por defecto.
 * @author L.I.A Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/builder/block-initializer.helper.ts.md
 */
import { logger } from "@/lib/logger";
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
      { blockType },
      `[BlockInitializer] Se intentó inicializar un tipo de bloque no definido.`
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

  // Corrección de la firma del logger para cumplir con la Directiva 1.1
  logger.trace(
    { type: blockType, id: newBlock.id },
    "[BlockInitializer] Nuevo bloque inicializado."
  );

  return newBlock;
}
// src/lib/builder/block-initializer.helper.ts
