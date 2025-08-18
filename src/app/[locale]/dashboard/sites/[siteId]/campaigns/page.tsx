// src/app/[locale]/dashboard/sites/[siteId]/campaigns/page.tsx
/**
 * @file src/app/[locale]/dashboard/sites/[siteId]/campaigns/page.tsx
 * @description Punto de entrada para la ruta de gestión de campañas. Ha sido
 *              nivelado para consumir el nuevo cargador de datos atomizado
 *              `CampaignsPageLoader`, completando la refactorización
 *              estructural de la capa de servidor.
 * @author Raz Podestá
 * @version 2.0.0
 */
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { logger } from "@/lib/logging";
import CampaignsPageSkeleton from "./loading";
import { CampaignsPageLoader } from "./campaigns-page-loader";

/**
 * @public
 * @async
 * @function generateMetadata
 * @description Genera los metadatos de la página de forma dinámica.
 * @param {object} props - Propiedades para la generación de metadatos.
 * @returns {Promise<Metadata>} Los metadatos de la página.
 */
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "CampaignsPage" });
  return {
    title: t("entityName"),
  };
}

/**
 * @public
 * @page CampaignsPage
 * @description Ensambla el `Suspense boundary` para el flujo de carga de datos de la página de campañas.
 * @param {object} props - Propiedades de la página.
 * @returns {JSX.Element}
 */
export default function CampaignsPage({
  params,
  searchParams,
}: {
  params: { siteId: string; locale: string };
  searchParams: { page?: string; q?: string };
}): JSX.Element {
  unstable_setRequestLocale(params.locale);
  logger.trace("[CampaignsPage] Renderizando punto de entrada y Suspense boundary.");
  return (
    <Suspense fallback={<CampaignsPageSkeleton />}>
      <CampaignsPageLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Observabilidad**: ((Implementada)) Se ha añadido `logger.trace` para monitorear el renderizado del punto de entrada.
 * 2. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación verbosa para formalizar el rol del aparato.
 * 3. **Alineación Arquitectónica**: ((Vigente)) El componente ya importa y renderiza el cargador de datos correcto (`campaigns-page-loader`), adhiriéndose a la arquitectura canónica.
 *
 * @subsection Melhorias Futuras
 * 1. **Metadatos Dinámicos**: ((Vigente)) La función `generateMetadata` podría ser mejorada para obtener el nombre del sitio (`site.name`) y usarlo en el título (ej. "Campañas para Mi Sitio"). Esto requeriría una consulta de datos adicional.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/page.tsx