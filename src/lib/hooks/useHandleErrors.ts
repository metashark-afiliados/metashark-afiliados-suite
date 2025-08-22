// src/lib/hooks/useHandleErrors.ts
/**
 * @file src/lib/hooks/useHandleErrors.ts
 * @description Hook Soberano que encapsula la lógica de manejo de errores del lado del cliente.
 *              Este aparato centraliza el feedback al usuario mediante `toast` y el registro
 *              persistente en el servidor mediante `createPersistentErrorLog`.
 *              Ha sido refactorizado para utilizar el "guardián de tipo" `isActionError`,
 *              resolviendo los errores de tipado de forma robusta.
 * @author L.I.A. Legacy
 * @version 1.0.4
 */
"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { ZodError } from "zod";

import { createPersistentErrorLog } from "@/lib/actions/_helpers/error-log.helper";
import { clientLogger } from "@/lib/logging";
import { type ActionResult, isActionError } from "@/lib/validators";

/**
 * @public
 * @function useHandleErrors
 * @description Hook para centralizar el manejo de errores en componentes de cliente.
 *              Proporciona una función `handleError` que interpreta el tipo de error,
 *              muestra un `toast` amigable al usuario y registra el error de forma
 *              persistente en la base de datos a través de una Server Action.
 * @returns {{ handleError: (error: unknown, context?: Record<string, any>) => Promise<void> }}
 *          Un objeto que contiene la función para manejar errores.
 */
export function useHandleErrors() {
  // CORRECCIÓN: Usar el namespace correcto "ValidationErrors" según src/messages/manifest.ts
  const tValidationErrors = useTranslations("ValidationErrors");

  const handleError = useCallback(
    async (error: unknown, context?: Record<string, any>) => {
      let userMessageKey: string;
      let logPayload: Record<string, any> = { context };
      let errorForLog: Error;

      if (isActionError(error)) {
        userMessageKey = tValidationErrors(error.error as any, {
          defaultValue: error.error,
        });
        errorForLog = new Error(error.error);
        logPayload.error = error.error;
        clientLogger.warn("[useHandleErrors] Server Action Error capturado:", {
          error: error.error,
          context,
        });
      } else if (error instanceof ZodError) {
        const firstIssue = error.errors[0];
        userMessageKey = firstIssue
          ? tValidationErrors(firstIssue.message as any, {
              defaultValue: firstIssue.message,
            })
          : tValidationErrors("error_server_generic");
        errorForLog = error;
        logPayload.error = JSON.stringify(error, null, 2);
        logPayload.issue = firstIssue;
        clientLogger.warn("[useHandleErrors] ZodError capturado:", {
          error,
          context,
        });
      } else if (error instanceof Error) {
        userMessageKey = error.message;
        errorForLog = error;
        logPayload.error = error.message;
        logPayload.stack = error.stack;
        clientLogger.error("[useHandleErrors] Error estándar capturado:", {
          error,
          context,
        });
      } else if (typeof error === "string") {
        userMessageKey = tValidationErrors("error_server_generic");
        errorForLog = new Error(error);
        logPayload.error = error;
        clientLogger.error("[useHandleErrors] Error de string capturado:", {
          error,
          context,
        });
      } else if (typeof error === "object" && error !== null) {
        userMessageKey = tValidationErrors("error_server_generic");
        errorForLog = new Error(JSON.stringify(error));
        logPayload.error = JSON.stringify(error, null, 2);
        clientLogger.error(
          "[useHandleErrors] Error de objeto genérico capturado:",
          {
            error,
            context,
          }
        );
      } else {
        userMessageKey = tValidationErrors("error_server_generic");
        errorForLog = new Error(String(error));
        logPayload.error = String(error);
        clientLogger.error("[useHandleErrors] Error desconocido capturado:", {
          error,
          context,
        });
      }

      toast.error(userMessageKey);

      await createPersistentErrorLog(
        "useHandleErrors",
        errorForLog,
        logPayload
      );
    },
    [tValidationErrors]
  );

  return { handleError };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Namespace de i18n**: ((Implementada)) Se ha corregido el namespace de `useTranslations` a `"ValidationErrors"`, alineándose con la clave definida en `src/messages/manifest.ts` y el `i18n.schema.ts`. Esto, en combinación con el `loadTestMessages` corregido, resuelve los errores `IntlError: MISSING_MESSAGE`.
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Usuario en `createPersistentErrorLog`**: ((Vigente)) El `handleError` podría ser mejorado para obtener el `userId` y el `locale` del contexto global (ej. `DashboardContext`) y pasarlos a `createPersistentErrorLog` como metadatos, enriqueciendo los logs del backend.
 * 2. **Tipado Estricto de Claves de `ValidationErrors`**: ((Vigente)) El tipo `error` en `ActionResult` es actualmente `string`. Podría ser refinado para ser `keyof typeof ValidationErrorsSchema` o un `z.enum` de todas las claves de error de i18n válidas. Esto permitiría al `isActionError` hacer una comprobación más estricta sobre el contenido del `error`.
 * 3. **Botón de Acción en Toast**: ((Vigente)) Para ciertos errores (ej. "Error de red"), el `toast` podría incluir un botón "Reintentar" o "Contactar Soporte", que ejecute un callback pasado al `handleError`.
 *
 * =====================================================================
 */
// src/lib/hooks/useHandleErrors.ts
