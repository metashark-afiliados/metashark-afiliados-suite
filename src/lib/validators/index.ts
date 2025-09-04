// src/lib/validators/index.ts
/**
 * @file validators/index.ts
 * @description Manifiesto de Validadores de Élite. Refactorizado para
 *              blindar el contrato `ActionResult` y elevar `isActionSuccess`
 *              a un guardián de tipo genérico para máxima seguridad de tipos.
 * @author RaZ Podestá - MetaShark Tech
 * @version 27.1.0
 * @see .docs-espejo/lib/validators/index.ts.md
 */
import { z } from "zod";

import { type NestedKeyOf } from "@/lib/i18n/types";
import { ValidationErrorsSchema } from "./i18n/ValidationErrors.schema";

// --- RE-EXPORTACIÓN DE LA BIBLIOTECA DE SCHEMAS ---
export * from "./schemas";
export * from "./i18n.schema";

// --- CONTRATOS DE ERROR TIPO-SEGUROS (AD-004) ---

type ValidationErrorsMessages = z.infer<typeof ValidationErrorsSchema>;

export type ValidationErrorKey = NestedKeyOf<ValidationErrorsMessages>;

export type ActionResult<TSuccess, TErrorData = unknown> =
  | { success: true; data: TSuccess }
  | { success: false; error: ValidationErrorKey; data?: TErrorData };

export function isActionError(
  result: unknown
): result is { success: false; error: ValidationErrorKey; data?: unknown } {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    result.success === false &&
    "error" in result &&
    typeof result.error === "string"
  );
}

/**
 * @public
 * @function isActionSuccess
 * @description Guardián de tipo genérico que verifica si un `ActionResult` es un resultado de éxito.
 *              Preserva el tipo del payload `data`.
 * @template TSuccess - El tipo del payload de éxito esperado.
 * @param {unknown} result - El valor a verificar.
 * @returns {result is { success: true; data: TSuccess }} `true` si es un éxito.
 */
export function isActionSuccess<TSuccess>(
  result: unknown
): result is { success: true; data: TSuccess } {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    result.success === true
  );
}
// src/lib/validators/index.ts
