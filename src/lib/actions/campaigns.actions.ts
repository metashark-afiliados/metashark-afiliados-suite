// src/lib/actions/campaigns.actions.ts
/**
 * @file src/lib/actions/campaigns.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              relacionadas con la entidad `campaigns`. Ensambla y exporta todas
 *              las acciones atómicas del directorio `campaigns/`.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use server";

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
 * 1. **Arquitectura de Manifiesto**: ((Implementada)) Se ha convertido este archivo en un barril, resolviendo la causa raíz de los errores de exportación de módulo.
 *
 * =====================================================================
 */
