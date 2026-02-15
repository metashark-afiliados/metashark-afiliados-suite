// src/lib/actions/creations/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              de `creations`. Sincronizado para incluir la acción de actualización.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
export * from "./create.action";
export * from "./update-content.action"; // <-- NUEVA EXPORTACIÓN
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación (TS2305)**: ((Implementada)) Se ha añadido la exportación de `updateCreationContentAction`. Esto resuelve el error de módulo no encontrado en `useBuilderHeader` y completa la refactorización de la lógica de guardado.
 * 2. **Integridad de Módulo**: ((Implementada)) El manifiesto ahora refleja con precisión el contenido completo del módulo, cumpliendo su rol de SSoT para las exportaciones.
 *
 * @subsection Melhorias Futuras
 * 1. **Acción `deleteCreationAction`**: ((Vigente)) La siguiente acción lógica a añadir a este módulo es la que permita la eliminación segura de una `Creation`, asegurándose de manejar o advertir sobre las `Campaigns` asociadas.
 *
 * =====================================================================
 */
// src/lib/actions/creations/index.ts
