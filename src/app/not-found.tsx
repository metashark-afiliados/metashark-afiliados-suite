// src/app/not-found.tsx
/**
 * @file src/app/not-found.tsx
 * @description Manejador de Errores 404 Global y Autónomo. Este aparato es la
 *              red de seguridad para todas las rutas no encontradas. Ha sido
 *              diseñado como un componente de cliente completamente desacoplado
 *              del contexto de `next-intl` para garantizar su funcionamiento
 *              incluso si el sistema de enrutamiento internacionalizado falla.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientLogger } from "@/lib/logging";
import { locales } from "@/lib/navigation";

// Se definen los locales localmente para hacer este componente 100% autónomo.
const supportedLocales = ["en-US", "es-ES", "pt-BR"] as const;

export default function NotFound(): React.ReactElement {
  const pathname = usePathname();

  useEffect(() => {
    clientLogger.warn(`[404 Handler] Ruta no encontrada: ${pathname}`);
  }, [pathname]);

  // Lógica de cliente segura para determinar el locale desde la URL.
  const segments = pathname.split("/");
  const potentialLocale = segments[1];
  const locale = supportedLocales.includes(potentialLocale as any)
    ? potentialLocale
    : "es-ES"; // Fallback al locale por defecto.

  // Textos estáticos para máxima resiliencia. No dependen del contexto de i18n.
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
            <Link href={`/${locale}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {messages.backToHome}
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/dashboard`}>
              <Home className="mr-2 h-4 w-4" />
              {messages.goToDashboard}
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
 * 1. **Arquitectura Resiliente**: ((Implementada)) Se mantiene el diseño desacoplado del snapshot original, garantizando que la página 404 nunca falle por problemas de contexto.
 * 2. **Observabilidad del Cliente**: ((Implementada)) Se ha añadido `clientLogger.warn` para registrar las rutas no encontradas en la consola del navegador, proporcionando una herramienta de diagnóstico útil para detectar enlaces rotos.
 *
 * @subsection Melhorias Futuras
 * 1. **Sugerencias de Rutas**: ((Vigente)) Se podría implementar una lógica que compare el `pathname` con una lista de rutas válidas (posiblemente desde `lib/navigation.ts`) y sugiera la ruta correcta al usuario.
 * 2. **Logging Persistente de 404**: ((Vigente)) Se podría crear una Server Action `logNotFoundAction(pathname)` que sea invocada desde el `useEffect` para registrar los errores 404 en la base de datos, permitiendo un análisis proactivo de enlaces rotos.
 *
 * =====================================================================
 */
// src/app/not-found.tsx
