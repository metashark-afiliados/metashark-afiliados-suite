// src/lib/builder/core/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para el núcleo de estado
 *              del Builder. Exporta la factoría del store y los contratos de datos
 *              esenciales, encapsulando los detalles de implementación internos
 *              (como los slices y el creador).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-24
 */

export { createBuilderStore } from "./store.factory";
export type { BuilderState, BuilderStore } from "./store.types";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Módulo Cohesiva**: ((Implementada)) Este archivo barril define una fachada limpia para el núcleo de estado, adhiriéndose a la "Filosofía LEGO" y mejorando la DX al simplificar las importaciones.
 * 2. **Encapsulamiento**: ((Implementada)) Los detalles de implementación como `store.creator.ts` y los `*Slice.ts` no se exportan, manteniendo la API del módulo simple, enfocada y fácil de entender.
 *
 * @subsection Melhorias Futuras
 * 1. **Exportación Condicional para Pruebas**: ((Vigente)) Se podría configurar el bundler de pruebas para que este archivo exporte adicionalmente los slices y creadores, facilitando las pruebas unitarias aisladas sin exponerlos en el build de producción.
 *
 * =====================================================================
 */
// src/lib/builder/core/index.ts
