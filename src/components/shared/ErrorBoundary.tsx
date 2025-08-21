// src/components/shared/ErrorBoundary.tsx
"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clientLogger } from "@/lib/logging";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

const DefaultFallback = ({ reset }: { reset: () => void }) => (
  <Card className="m-4 flex flex-col items-center justify-center p-8 text-center bg-destructive/10 border-destructive/50">
    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
    <h2 className="text-xl font-bold text-destructive-foreground">
      Ocurrió un Error Inesperado
    </h2>
    <p className="text-muted-foreground mt-2">
      Se ha producido un error de renderizado en esta sección. Por favor,
      intenta recargar la página.
    </p>
    <Button onClick={reset} variant="destructive" className="mt-6">
      Intentar de Nuevo
    </Button>
  </Card>
);

/**
 * @public
 * @component ErrorBoundary
 * @description Componente de UI atómico que captura errores de renderizado.
 *              Alineado con la API de Button v12.0.
 * @author Raz Podestá
 * @version 1.1.0
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    clientLogger.error("Error de renderizado capturado por ErrorBoundary:", {
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <DefaultFallback reset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Alineación de API**: ((Implementada)) Se ha corregido el uso de la prop `variant` en el `Button`, resolviendo el error de tipo.
 * =====================================================================
 */