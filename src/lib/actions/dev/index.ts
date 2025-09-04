// src/lib/actions/dev/diagnostics/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del sub-dominio de diagnóstico.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

export { triggerSentryErrorAction } from "./triggerSentryError.action";
// src/lib/actions/dev/diagnostics/index.ts
