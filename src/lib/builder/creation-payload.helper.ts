// src/lib/builder/creation-payload.helper.ts
/**
 * @file creation-payload.helper.ts
 * @description Aparato helper atómico y puro. Actúa como una factoría para
 *              generar payloads de datos para nuevas `Creations`. Es la Única
 *              Fuente de Verdad (SSoT) para la estructura de datos inicial de
 *              cualquier diseño soberano en la aplicación.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import "server-only";

import { type Json, type TablesInsert } from "@/lib/types/database";

/**
 * @public
 * @function generateCreationPayload
 * @description Función pura que genera el payload de datos listo para ser
 *              insertado en la tabla `creations`.
 * @param {object} params - Los parámetros necesarios para generar el payload.
 * @param {string} params.userId - El ID del usuario que crea el diseño.
 * @param {string} params.workspaceId - El ID del workspace al que pertenecerá.
 * @param {string} params.name - El nombre inicial del diseño.
 * @param {string} params.type - El tipo de diseño (ej. "landing-page").
 * @returns {TablesInsert<"creations">} El payload completo para la inserción.
 */
export function generateCreationPayload({
  userId,
  workspaceId,
  name,
  type,
}: {
  userId: string;
  workspaceId: string;
  name: string;
  type: string;
}): TablesInsert<"creations"> {
  // En el futuro, la estructura del 'content' inicial podría variar
  // según el 'type' de creación, cargando diferentes plantillas base.
  const initialContent: Json = {
    theme: { globalFont: "Inter", globalColors: {} },
    blocks: [],
  };

  return {
    name,
    created_by: userId,
    workspace_id: workspaceId,
    content: initialContent,
  };
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Factoría)**: ((Implementada)) Este aparato tiene la única y clara responsabilidad de crear payloads para la entidad `Creation`, cumpliendo con el SRP y la "Filosofía LEGO".
 * 2. **Desacoplamiento Total**: ((Implementada)) Al ser una función pura sin efectos secundarios, es inherentemente robusta, predecible y fácil de probar unitariamente.
 *
 * @subsection Melhorias Futuras
 * 1. **Inicialización Basada en Plantillas**: ((Vigente)) Extender la función para que acepte un `templateId` opcional. Si se proporciona, la función podría obtener los datos de una plantilla desde la capa de datos (`src/lib/data`) y usar su `content` como el valor inicial, en lugar de un objeto vacío.
 * 2. **Tipado Fuerte para `content`**: ((Vigente)) Reemplazar el tipo `Json` por un tipo inferido de un `CreationContentSchema` de Zod para una validación más estricta de la estructura del contenido.
 *
 * =====================================================================
 */
// src/lib/builder/creation-payload.helper.ts
