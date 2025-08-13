// src/app/[locale]/dashboard/sites/page.tsx
/**
 * @file src/app/[locale]/dashboard/sites/page.tsx
 * @description Punto de entrada para la ruta "Mis Sitios". Su única responsabilidad
 *              es renderizar el componente de carga de datos (`SitesPageLoader`)
 *              dentro de un `Suspense boundary`, mostrando un esqueleto de carga
 *              de alta fidelidad para una experiencia de usuario de élite.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { Suspense } from "react";

import { Card } from "@/components/ui/card";

import { SitesPageLoader } from "./sites-page-loader";

/**
 * @private
 * @component SitesPageSkeleton
 * @description Renderiza un esqueleto de carga que imita la estructura de la página final.
 * @returns {React.ReactElement}
 */
const SitesPageSkeleton = () => (
  <div className="space-y-6 relative animate-pulse">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div className="h-8 w-32 bg-muted rounded-md" />
        <div className="h-5 w-72 bg-muted rounded-md mt-2" />
      </div>
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="h-10 w-full md:w-64 bg-muted rounded-md" />
        <div className="h-10 w-32 bg-muted rounded-md" />
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-40 bg-muted" />
      ))}
    </div>
  </div>
);

/**
 * @public
 * @page SitesPage
 * @description Ensambla el `Suspense boundary` para el flujo de carga de datos.
 * @param {object} props
 * @param {{ page?: string; q?: string }} props.searchParams
 * @returns {React.ReactElement}
 */
export default function SitesPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  return (
    <Suspense fallback={<SitesPageSkeleton />}>
      <SitesPageLoader searchParams={searchParams} />
    </Suspense>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Esqueleto de Carga Detallado**: ((Vigente)) El esqueleto podría ser aún más detallado, por ejemplo, mostrando sub-esqueletos dentro de las tarjetas para imitar con mayor precisión la UI final y reducir el Layout Shift (CLS).
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Carga de Élite**: ((Implementada)) El uso del patrón `Page` -> `Suspense` -> `Loader` es la implementación canónica y de más alto rendimiento para la carga de datos en el App Router de Next.js.
 * 2. **Experiencia de Usuario Instantánea**: ((Implementada)) Al mostrar un esqueleto de carga de inmediato, se mejora drásticamente la experiencia de usuario percibida, eliminando pantallas en blanco durante la obtención de datos.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/page.tsx
