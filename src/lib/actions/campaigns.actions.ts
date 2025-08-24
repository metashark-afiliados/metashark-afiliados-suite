// src/lib/actions/campaigns.actions.ts
/**
 * @file src/lib/actions/campaigns.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              relacionadas con la entidad `campaigns`. Ensambla y exporta todas
 *              las acciones atómicas del directorio `campaigns/`. Sincronizado
 *              para incluir `createCampaignFromTemplateAction`.
 * @author Raz Podestá
 * @version 3.0.0
 */

export * from "./campaigns/archive.action";
export * from "./campaigns/assign-site.action";
export * from "./campaigns/create.action";
export * from "./campaigns/create-from-template.action"; // <-- ACCIÓN RESTAURADA
export * from "./campaigns/delete.action";
export * from "./campaigns/duplicate.action";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de `TS2339`**: ((Implementada)) Se ha añadido la exportación de `createCampaignFromTemplateAction`. Esto resuelve el error de importación en `.../builder/new/page.tsx`, ya que la acción ahora es parte de la API pública del módulo `campaigns`.
 * 2. **Integridad de Módulo**: ((Implementada)) El manifiesto ahora refleja con precisión el contenido del módulo, cumpliendo con su rol de SSoT para las exportaciones.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo sigue siendo un candidato ideal para ser generado y mantenido por un script, previniendo errores de omisión manual en el futuro.
 *
 * =====================================================================
 */
// src/lib/actions/campaigns.actions.ts
