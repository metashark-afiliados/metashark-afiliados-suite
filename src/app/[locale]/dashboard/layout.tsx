// src/app/[locale]/dashboard/layout.tsx
import React from "react";
import { redirect } from "next/navigation";

import { DashboardContextProviders } from "@/components/layout/DashboardContextProviders";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { getLayoutData } from "@/components/layout/dashboard.loader";
import { GlobalOverlays } from "@/components/layout/GlobalOverlays";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component DashboardLayout
 * @description Orquesta la estructura, obtención de datos y proveedores de contexto
 *              para toda la sección autenticada de la aplicación. Actúa como un
 *              ensamblador puro, delegando la lógica a aparatos atómicos.
 * @param {{ children: React.ReactNode }} props
 * @returns {Promise<React.ReactElement>}
 * @author Raz Podestá
 * @version 11.0.0
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  logger.trace("[DashboardLayout] Ensamblando layout de élite...");
  const layoutData = await getLayoutData();

  if (!layoutData) {
    return redirect("/auth/login?next=/dashboard");
  }

  return (
    <DashboardContextProviders value={layoutData}>
      <div className="flex min-h-screen w-full bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
        {/* --- INYECCIÓN DE CAPA DE UI GLOBAL --- */}
        <GlobalOverlays />
      </div>
    </DashboardContextProviders>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integración de Capa de UI Global**: ((Implementada)) Se ha añadido el componente `<GlobalOverlays />` al layout. Este cambio crítico inyecta el `AuthDialog` y otros componentes modales en el árbol de la aplicación, haciéndolos funcionalmente disponibles en todo el entorno autenticado.
 * 2. **Atomicidad Radical (Ensamblador Puro)**: ((Vigente)) El `DashboardLayout` mantiene su rol de ensamblador puro, componiendo aparatos atómicos con responsabilidades únicas.
 *
 * @subsection Melhorias Futuras
 * 1. **Layouts Anidados Dinámicos**: ((Vigente)) Para futuras secciones del dashboard con estructuras diferentes (ej. un layout de ancho completo para un editor), se podría implementar una lógica para que `getLayoutData` también devuelva un `layoutType` que este componente usaría para renderizar condicionalmente diferentes estructuras de `div`.
 *
 * =====================================================================
 */
