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

import CampaignsPageSkeleton from "./loading";
import { CampaignsPageLoader } from "./campaigns-page-loader"; // <-- CORRECCIÓN DE IMPORTACIÓN

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

export default function CampaignsPage({
  params,
  searchParams,
}: {
  params: { siteId: string; locale: string };
  searchParams: { page?: string; q?: string };
}) {
  unstable_setRequestLocale(params.locale);
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
 * 1. **Alineación Arquitectónica**: ((Implementada)) El componente ahora importa y renderiza el cargador de datos correcto (`campaigns-page-loader`), restaurando la arquitectura canónica. Cero regresiones de funcionalidad.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/sites/[siteId]/campaigns/page.tsx
