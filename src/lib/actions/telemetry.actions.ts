// src/lib/actions/telemetry.actions.ts
/**
 * @file telemetry.actions.ts
 * @description Manifiesto (Barrel File) y API pública para las Server Actions
 *              del dominio de telemetría. Ensambla y exporta las
 *              acciones atómicas desde sus módulos soberanos.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 1.0.0
 * @see .docs-espejo/lib/actions/telemetry.actions.ts.md
 */
"use server";
import "server-only";

export { enrichVisitorLogAction } from "./telemetry/enrichVisitorLog.action";
export { logVisitorAction } from "./telemetry/logVisitor.action";
// src/lib/actions/telemetry.actions.ts
