// src/app/[locale]/dashboard/sites/page.tsx
/**
 * @file page.tsx
 * @description Punto de entrada para la ruta "Mis Sitios". Refactorizado para
 *              utilizar un `Suspense boundary`, mostrando un esqueleto de carga
 *              inmediato para una UX de élite.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { unstable_setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { logger } from "@/lib/logger";
import SitesPageSkeleton from "./loading";
import { SitesPageLoader } from "./sites-page-loader";

export default function SitesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string; q?: string };
}): React.ReactElement {
  unstable_setRequestLocale(locale);
  logger.trace(
    "[SitesPage] Renderizando punto de entrada y Suspense boundary."
  );
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
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Arquitectura de Carga de Élite:** El uso del patrón `Page` -> `Suspense` -> `Loader` es la implementación canónica y de más alto rendimiento, resolviendo la brecha de performance.
 * 2. ((Implementada)) **Refactorización de `loading.tsx`:** El esqueleto ha sido movido a su propio archivo canónico.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/page.tsx
