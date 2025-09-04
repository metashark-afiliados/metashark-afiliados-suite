// src/lib/actions/creations/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio `creations`. Define el punto de entrada canónico para
 *              todas las operaciones de negocio relacionadas con los diseños soberanos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

export { createCreationAction } from "./create.action";
export { updateCreationContentAction } from "./update-content.action";
// src/lib/actions/creations/index.ts
