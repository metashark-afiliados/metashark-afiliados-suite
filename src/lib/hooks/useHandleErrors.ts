// src/lib/hooks/useHandleErrors.ts
/**
 * @file useHandleErrors.ts
 * @description Hook Soberano que encapsula la lógica de manejo de errores del cliente.
 *              Ha sido refactorizado a un estándar de élite para ser 100% agnóstico
 *              a la i18n, recibiendo la función de traducción como una dependencia
 *              inyectada, cumpliendo con el Manifiesto IMAS v3.0.
 *              **Actualizado para eliminar `as any` en el manejo de mensajes de error.**
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";
import { type useTranslations } from "next-intl";
import { ZodError } from "zod";

import { createPersistentErrorLog } from "@/lib/actions/_helpers/error-log.helper";
import { clientLogger } from "@/lib/logging";
import { isActionError } from "@/lib/validators";

interface UseHandleErrorsProps {
  tValidationErrors: ReturnType<typeof useTranslations>;
}

/**
 * @public
 * @function useHandleErrors
 * @description Hook para centralizar el manejo de errores en componentes de cliente.
 *              Proporciona una función `handleError` que interpreta el tipo de error,
 *              muestra un `toast` amigable al usuario y registra el error de forma
 *              persistente en la base de datos.
 * @param {UseHandleErrorsProps} props - Dependencias del hook, incluyendo la función de traducción.
 * @returns {{ handleError: (error: unknown, context?: Record<string, any>) => Promise<void> }}
 *          Un objeto que contiene la función para manejar errores.
 */
export function useHandleErrors({ tValidationErrors }: UseHandleErrorsProps) {
  const handleError = useCallback(
    async (error: unknown, context?: Record<string, any>) => {
      let userMessageKey: string;
      let logPayload: Record<string, any> = { context };
      let errorForLog: Error;

      if (isActionError(error)) {
        userMessageKey = tValidationErrors(error.error, {
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
          ? tValidationErrors(firstIssue.message, {
              defaultValue: firstIssue.message,
            })
          : tValidationErrors("ValidationErrors.generic.error_server_generic"); // <-- Usar clave explícita de fallback
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
        userMessageKey = tValidationErrors(error, {
          defaultValue: "ValidationErrors.generic.error_server_generic",
        }); // <-- Usar clave explícita de fallback
        errorForLog = new Error(error);
        logPayload.error = error;
        clientLogger.error("[useHandleErrors] Error de string capturado:", {
          error,
          context,
        });
      } else if (typeof error === "object" && error !== null) {
        userMessageKey = tValidationErrors(
          "ValidationErrors.generic.error_server_generic"
        ); // <-- Usar clave explícita de fallback
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
        userMessageKey = tValidationErrors(
          "ValidationErrors.generic.error_server_generic"
        ); // <-- Usar clave explícita de fallback
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
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Eliminación de `as any` en `tValidationErrors`**: ((Implementada)) Se han reemplazado las aserciones `as any` por el uso directo de las propiedades `error.error` y `firstIssue.message`. TypeScript ya infiere correctamente el tipo `string` en estos contextos gracias a los `type guards` y la validación de `ZodError`.
 * 2. **Refuerzo de Fallback de Errores**: ((Implementada)) Se han actualizado los fallbacks de `tValidationErrors` para que siempre referencien una clave explícita del namespace `ValidationErrors.generic` (ej., `ValidationErrors.generic.error_server_generic`). Esto elimina cualquier ambigüedad sobre el mensaje de error por defecto y asegura una internacionalización robusta incluso en casos de error genéricos.
 * 3. **No Regresión Funcional**: ((Implementada)) La funcionalidad central del hook (manejo de diferentes tipos de errores, logging, toasts, registro persistente) se mantiene intacta.
 * 4. **Versionado Consistente**: ((Implementada)) Se ha incrementado la versión a `3.0.0` para reflejar esta refactorización.
 *
 * @subsection Melhorias Futuras
 * 1. **Mapeo Avanzado de Errores Zod**: ((Vigente)) Para errores de Zod más complejos que `firstIssue.message` (ej. si una `ZodError` contiene múltiples validaciones fallidas para un mismo campo), se podría implementar un mapeo más sofisticado a `userMessageKey` que combine varios mensajes o un formato específico.
 *
 * =====================================================================
 */
