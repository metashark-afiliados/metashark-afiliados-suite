// src/lib/hooks/useHandleErrors.ts
/**
 * @file useHandleErrors.ts
 * @description Hook Soberano que encapsula la lógica de manejo de errores del lado del cliente.
 *              Este aparato centraliza el feedback al usuario mediante `toast` y el registro
 *              persistente en el servidor mediante `createPersistentErrorLog`.
 *              Ha sido refactorizado para utilizar el namespace de i18n canónico,
 *              resolviendo un error crítico de build `MISSING_MESSAGE`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { ZodError } from "zod";

import { createPersistentErrorLog } from "@/lib/actions/_helpers/error-log.helper";
import { clientLogger } from "@/lib/logging";
import { isActionError } from "@/lib/validators";

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
  const tValidationErrors = useTranslations("shared.ValidationErrors");

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
 * 1. **Resolución de `MISSING_MESSAGE`**: ((Implementada)) Se ha corregido el namespace de `useTranslations` a `"shared.ValidationErrors"`. Esta es la corrección de élite que resuelve la causa raíz del error de build `MISSING_MESSAGE`, alineando el hook con la arquitectura IMAS y los schemas de Zod.
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Usuario en Logs**: ((Vigente)) El `handleError` podría mejorarse para obtener el `userId` y el `locale` del `DashboardContext` y pasarlos a `createPersistentErrorLog` como metadatos, enriqueciendo los logs del backend.
 * 2. **Tipado Estricto de Claves de Error**: ((Vigente)) El tipo `error` en `ActionResult` es actualmente `string`. Podría refinarse para ser `keyof typeof ValidationErrorsSchema` o un `z.enum` de todas las claves de error de i18n válidas, permitiendo una comprobación más estricta.
 * 3. **Botón de Acción en Toast**: ((Vigente)) Para ciertos errores (ej. "Error de red"), el `toast` podría incluir un botón "Reintentar" o "Contactar Soporte", que ejecute un callback pasado al `handleError`.
 *
 * =====================================================================
 */
