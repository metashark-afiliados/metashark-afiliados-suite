// src/app/[locale]/dev-console/diagnostics/diagnostics-client.tsx
/**
 * @file diagnostics-client.tsx
 * @description Componente de cliente interactivo para la página de diagnóstico.
 *              Refactorizado para resolver errores de compilación y mejorar
 *              la observabilidad y el manejo de errores.
 * @author L.I.A. Legacy & RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-09-01
 * @see .docs-espejo/app/[locale]/dev-console/diagnostics/diagnostics-client.tsx.md
 */
"use client";
import React, { useEffect, useState, useTransition } from "react";
import * as Sentry from "@sentry/nextjs";
import toast from "react-hot-toast";

import { dev as devActions } from "@/lib/actions";
import { clientLogger } from "@/lib/logging";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DiagnosticsPageTexts {
  title: string;
  description: string;
  connectivity: {
    title: string;
    description: string;
    sentry_ok: string;
    sentry_fail: string;
  };
  actions: {
    title: string;
    description: string;
    frontend_error_button: string;
    frontend_error_toast: string;
    backend_error_button: string;
    backend_error_toast_success: string;
    backend_error_toast_fail: string;
  };
}

interface DiagnosticsClientProps {
  texts: DiagnosticsPageTexts;
}

export function DiagnosticsClient({
  texts,
}: DiagnosticsClientProps): React.ReactElement {
  clientLogger.trace(
    "[DiagnosticsClient] Renderizando orquestador de UI interactivo."
  );
  const [sentryStatus, setSentryStatus] = useState<"checking" | "ok" | "fail">(
    "checking"
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function checkSentry() {
      const result = await Sentry.diagnoseSdkConnectivity();
      const status = result === "sentry-unreachable" ? "fail" : "ok";
      setSentryStatus(status);
      clientLogger.info(
        `[DiagnosticsClient] Sentry connectivity status: ${status}`
      );
    }
    checkSentry();
  }, []);

  const handleFrontendError = () => {
    try {
      throw new Error("DIAG-C-01: Error de cliente de diagnóstico provocado.");
    } catch (error) {
      Sentry.captureException(error);
      toast.success(texts.actions.frontend_error_toast);
      clientLogger.info(
        "[DiagnosticsClient] Error de frontend provocado y enviado a Sentry."
      );
    }
  };

  const handleBackendError = () => {
    startTransition(async () => {
      try {
        await devActions.diagnostics.triggerSentryErrorAction();
        toast.error(texts.actions.backend_error_toast_fail);
      } catch (error) {
        toast.success(texts.actions.backend_error_toast_success);
        clientLogger.info(
          "[DiagnosticsClient] Error de backend provocado. La captura y el re-lanzamiento fueron exitosos."
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{texts.title}</h1>
        <p className="text-muted-foreground">{texts.description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{texts.connectivity.title}</CardTitle>
          <CardDescription>{texts.connectivity.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              "text-sm font-medium",
              sentryStatus === "ok" && "text-green-500",
              sentryStatus === "fail" && "text-destructive"
            )}
          >
            {sentryStatus === "checking" && "Verificando..."}
            {sentryStatus === "ok" && texts.connectivity.sentry_ok}
            {sentryStatus === "fail" && texts.connectivity.sentry_fail}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{texts.actions.title}</CardTitle>
          <CardDescription>{texts.actions.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={handleFrontendError}
            disabled={sentryStatus !== "ok"}
          >
            {texts.actions.frontend_error_button}
          </Button>
          <Button
            variant="destructive"
            onClick={handleBackendError}
            disabled={sentryStatus !== "ok" || isPending}
            isLoading={isPending}
          >
            {texts.actions.backend_error_button}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
// src/app/[locale]/dev-console/diagnostics/diagnostics-client.tsx
