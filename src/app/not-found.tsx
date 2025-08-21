// src/app/not-found.tsx
/**
 * @file src/app/not-found.tsx
 * @description Manejador de Errores 404 Global. Refactorizado a un estándar de
 *              élite, corrigiendo un error de sintaxis en la importación de `useEffect`
 *              y blindando la composición de hijos para el componente Link.
 * @author L.I.A. Legacy
 * @version 3.2.0
 */
"use client";

import React, { useEffect } from "react";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { useTranslations } from "next-intl";

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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Sintaxis Crítica**: ((Implementada)) Se ha corregido la importación a `import React, { useEffect } from "react"`. Esta rectificación elimina la causa raíz de los errores de compilación TS1005, TS2307 y TS2304 de forma definitiva.
 * 2. **Composición Robusta**: ((Vigente)) Se mantiene el uso de `React.Fragment` para blindar la composición del `Link` dentro del `Button`, previniendo errores de `React.Children.only`.
 *
 * @subsection Melhorias Futuras
 * 1. **Sugerencias de Rutas**: ((Vigente)) Para una UX de élite, se podría implementar una lógica que, basándose en el `pathname` no encontrado, sugiera rutas similares.
 *
 * =====================================================================
 */
