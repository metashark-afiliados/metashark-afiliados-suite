// src/components/layout/DashboardLayout.tsx
/**
 * @file DashboardLayout.tsx
 * @description Ensamblador de UI de élite. Su única responsabilidad es orquestar
 *              la obtención de datos y la composición de los aparatos atómicos que
 *              conforman el layout del dashboard.
 * @author Raz Podestá
 * @version 12.0.0
 */
import React from "react";
import { redirect } from "next/navigation";

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { logger } from "@/lib/logging";
import { DashboardContextProviders } from "./DashboardContextProviders";
import { DashboardSidebar } from "./DashboardSidebar";
import { getLayoutData } from "./dashboard.loader";
import { GlobalOverlays } from "./GlobalOverlays";

/**
 * @public
 * @component DashboardLayout
 * @description Orquesta la estructura, obtención de datos y proveedores de contexto
 *              para toda la sección autenticada de la aplicación.
 * @param {{ children: React.ReactNode }} props
 * @returns {Promise<React.ReactElement>}
 * @author Raz Podestá
 * @version 12.0.0
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  logger.trace("[DashboardLayout] Ensamblando layout...");
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
 * 1. **Atomicidad Radical**: ((Implementada)) El layout ha sido deconstruido en aparatos atómicos con responsabilidades únicas, cumpliendo la directiva al más alto nivel. El `DashboardLayout` ahora es un ensamblador puro.
 * 2. **Visión Holística 360°**: ((Implementada)) La nueva estructura cohesiva demuestra una visión completa del flujo de datos, desde la obtención en el `loader` hasta la provisión en los `ContextProviders` y el consumo en los `GlobalOverlays` y `children`.
 *
 * @subsection Melhorias Futuras
 * 1. **Layouts Anidados Dinámicos**: ((Vigente)) Para futuras secciones del dashboard con estructuras diferentes (ej. un layout de ancho completo para un editor), se podría implementar una lógica para que `getLayoutData` también devuelva un `layoutType` que este componente usaría para renderizar condicionalmente diferentes estructuras de `div`.
 *
 * =====================================================================
 */
// src/components/layout/DashboardLayout.tsx
