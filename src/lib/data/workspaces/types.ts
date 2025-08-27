// src/lib/data/workspaces/types.ts
/**
 * @file types.ts
 * @description Aparato de contrato de datos y SSoT para la entidad 'workspaces'.
 *              Centraliza todas las definiciones de tipo necesarias para las
 *              operaciones de datos del módulo de workspaces.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { type Tables } from "@/lib/types/database";

export type Workspace = Tables<"workspaces">;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Centralización de Contratos (SSoT)**: ((Implementada)) Este nuevo aparato se convierte en la SSoT para los tipos de datos del módulo `workspaces`, mejorando la organización, la legibilidad y eliminando la duplicación de tipos.
 * 2. **Consistencia Arquitectónica**: ((Implementada)) La creación de este archivo inicia el patrón de atomización de la capa de datos (`[entidad].data.ts`, `types.ts`, `index.ts`), haciendo que la estructura del módulo `workspaces` sea consistente con el resto de la capa de datos.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipos Derivados**: ((Vigente)) Si en el futuro se necesitan tipos más específicos (ej. `WorkspaceBasicInfo` con solo `id` y `name`), deberían ser definidos aquí para mantener la cohesión.
 *
 * =====================================================================
 */
// src/lib/data/workspaces/types.ts
