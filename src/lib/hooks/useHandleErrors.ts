// src/lib/hooks/useHandleErrors.ts
/**
 * @file useHandleErrors.ts
 * @description Hook Soberano que encapsula la lógica de manejo de errores del cliente.
 *              Ha sido refactorizado a un estándar de élite para ser 100% agnóstico
 *              a la i18n, recibiendo la función de traducción como una dependencia
 *              inyectada, cumpliendo con el Manifiesto IMAS v3.0.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-25
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
 * 1. ((Implementada)) Sincronización de Contrato de Tipo: La prop `tValidationErrors` ahora espera el tipo genérico de `next-intl`, haciendo al hook más robusto y desacoplado de nuestra implementación `useTypedTranslations`.
 *
 * =====================================================================
 */
