// src/app/not-found.tsx
/**
 * @file src/app/not-found.tsx
 * @description Manejador de Errores 404 Global. Ha sido refactorizado a un
 *              estándar de élite para resolver un error crítico de build
 *              (`React.Children.only`) envolviendo los múltiples hijos de los
 *              componentes `Link` en un único `<span>`.
 * @author L.I.A. Legacy
 * @version 2.1.0
 */
"use client";

import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { clientLogger } from "@/lib/logging";
import { Link } from "@/lib/navigation";

export default function NotFound(): React.ReactElement {
  const pathname = usePathname();

  useEffect(() => {
    clientLogger.warn(`[404 Handler] Ruta no encontrada: ${pathname}`);
  }, [pathname]);

  const messages = {
    title: "Error 404",
    description: `La página que buscas no existe o fue movida.`,
    backToHome: "Volver al Inicio",
    goToDashboard: "Ir al Dashboard",
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-16 w-16 text-primary" />
        <h1 className="mt-8 text-4xl font-extrabold tracking-tighter md:text-6xl">
          {messages.title}
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          {messages.description}
        </p>
        <div className="mt-10 flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <span className="inline-flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {messages.backToHome}
              </span>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <span className="inline-flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                {messages.goToDashboard}
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se ha envuelto el contenido de los `Link` (icono + texto) en un `<span>`. Esto proporciona un único hijo, resolviendo el error `React.Children.only` y completando la erradicación del Blocker #1.
 *
 * @subsection Melhorias Futuras
 * 1. **Internacionalización Completa**: ((Pendiente)) El contenido sigue codificado. Reaplicar la refactorización a `useTranslations` es el siguiente paso de élite.
 *
 * =====================================================================
 */
// src/app/not-found.tsx
