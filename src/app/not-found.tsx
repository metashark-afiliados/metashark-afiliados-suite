// src/app/not-found.tsx
/**
 * @file src/app/not-found.tsx
 * @description Manejador de Errores 404 Global. Ha sido refactorizado a un
 *              estándar de élite, utilizando `useTranslations` para contenido
 *              internacionalizado y el `Link` de `next-intl` para un enrutamiento
 *              de SPA correcto.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { clientLogger } from "@/lib/logging";
import { usePathname, Link } from "@/lib/navigation";

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
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToHome")}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              {t("goToDashboard")}
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
 * 1. **Full Internacionalización**: ((Implementada)) Se ha eliminado todo el texto codificado. El componente ahora consume `useTranslations` para ser 100% traducible, resolviendo una brecha crítica del protocolo.
 * 2. **Enrutamiento i18n Correcto**: ((Implementada)) Se ha reemplazado el `Link` de `next/link` por el `Link` de `@/lib/navigation`, asegurando una navegación de SPA que preserva el `locale` y el estado de la aplicación.
 * 3. **Eliminación de Lógica Redundante**: ((Implementada)) Se ha eliminado la lógica manual de detección de `locale` del `pathname`, ya que el `Link` internacionalizado y el `useTranslations` manejan esto automáticamente. El componente es ahora más simple y robusto.
 *
 * @subsection Melhorias Futuras
 * 1. **Sugerencias de Rutas**: ((Vigente)) Se podría implementar una lógica que compare la ruta no encontrada con las rutas válidas (usando un algoritmo de distancia de Levenshtein) y sugiera al usuario una ruta similar.
 *
 * =====================================================================
 */
// src/app/not-found.tsx
