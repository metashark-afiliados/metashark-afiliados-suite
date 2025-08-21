// src/lib/actions/campaigns.actions.ts
/**
 * @file src/lib/actions/campaigns.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              relacionadas con la entidad `campaigns`. Ensambla y exporta todas
 *              las acciones atómicas del directorio `campaigns/`.
 * @author Raz Podestá
 * @version 2.1.0
 */

export * from "./campaigns/archive.action";
export * from "./campaigns/assign-site.action";
export * from "./campaigns/create.action";
export * from "./campaigns/create-from-template.action";
export * from "./campaigns/delete.action";
export * from "./campaigns/duplicate.action";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica**: ((Implementada)) Se ha eliminado la directiva "use server", resolviendo la causa raíz del error de compilación.
 *
 * =====================================================================
 */
