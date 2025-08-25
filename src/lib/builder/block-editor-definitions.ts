// src/lib/builder/block-editor-definitions.ts
/**
 * @file block-editor-definitions.ts
 * @description Ensamblador final y Única Fuente de Verdad (SSoT) que construye el
 *              manifiesto de edición completo a partir de sus definiciones atómicas.
 *              Esta es una implementación de élite de la "Filosofía LEGO".
 * @author Raz Podestá - MetaShark Tech
 * @version 7.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type BlockEditableDefinition } from "./types.d";
import { Features1Definition } from "./definitions/features1.definition";
import { Footer1Definition } from "./definitions/footer1.definition";
import { Header1Definition } from "./definitions/header1.definition";
import { Hero1Definition } from "./definitions/hero1.definition";
import { Testimonials1Definition } from "./definitions/testimonials1.definition";

/**
 * @public
 * @constant blockEditorDefinitions
 * @description El registro canónico y ensamblado que define todas las
 *              propiedades editables para cada tipo de bloque.
 */
export const blockEditorDefinitions: Record<string, BlockEditableDefinition> = {
  Header1: Header1Definition,
  Hero1: Hero1Definition,
  Features1: Features1Definition,
  Testimonials1: Testimonials1Definition,
  Footer1: Footer1Definition,
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomización Radical y Escalabilidad**: ((Implementada)) La descomposición del manifiesto monolítico en archivos atómicos mejora drásticamente la escalabilidad y mantenibilidad. Añadir un nuevo bloque ahora es un proceso aislado y sin riesgo de conflictos.
 * 2. **Principio de Responsabilidad Única (SRP) a Nivel de Módulo**: ((Implementada)) Cada archivo `*.definition.ts` tiene una única responsabilidad. Este archivo ahora solo tiene la responsabilidad de ensamblar.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Dinámica de Definiciones**: ((Vigente)) Para una escalabilidad máxima, el ensamblador podría leer dinámicamente el directorio `definitions/` y construir el objeto `blockEditorDefinitions` automáticamente, eliminando la necesidad de importaciones manuales.
 *
 * =====================================================================
 */
// src/lib/builder/block-editor-definitions.ts
