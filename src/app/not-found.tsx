// src/app/not-found.tsx
/**
 * @file src/app/not-found.tsx
 * @description Manejador de Errores 404 Global. Refactorizado a un estándar de
 *              élite, blindando la composición de hijos para el componente Link
 *              para ser inmune al error `React.Children.only`.
 * @author L.I.A. Legacy
 * @version 3.1.0
 */
"use client";

import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { clientLogger } from "@/lib/logging";
import { Link, usePathname } from "@/lib/navigation";

export default function NotFound(): React.ReactElement {
  const t = useTranslations("pages.NotFoundPage");
  const pathname = usePathname();

  useEffect(() => {
    clientLogger.warn(`[404 Handler] Ruta no encontrada: ${pathname}`);
  }, [pathname]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-16 w-16 text-primary" />
        <h1 className="mt-8 text-4xl font-extrabold tracking-tighter md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-10 flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToHome")}
              </>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <>
                <Home className="mr-2 h-4 w-4" />
                {t("goToDashboard")}
              </>
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
 * @subsection Melhorias Adicionadas
 * 1. **Composición Robusta**: ((Implementada)) El contenido del `Link` ahora está envuelto en un `React.Fragment`, proporcionando un único hijo explícito al `Button` y resolviendo de forma definitiva el error `React.Children.only`.
 *
 * @subsection Melhorias Futuras
 * 1. **Sugerencias de Rutas**: ((Vigente)) Se podría implementar una lógica que sugiera rutas similares a la no encontrada para mejorar la UX.
 * =====================================================================
 */
// src/app/not-found.tsx
