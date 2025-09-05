// src/lib/actions/dev/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de desarrollo y diagnóstico. Ensambla y exporta los
 *              sub-módulos bajo un namespace para una API cohesiva.
 * @author L.I.A. Legacy
 * @version 2.0.0
 * @see .docs-espejo/lib/actions/dev/index.ts.md
 */
"use server";
import "server-only";

import * as diagnostics from "./diagnostics.actions";

export { diagnostics };
// src/lib/actions/dev/index.ts