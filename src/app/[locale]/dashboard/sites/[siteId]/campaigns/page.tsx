/**
 * @file page.tsx
 * @description Punto de entrada para la ruta de gestión de campañas. Su única
 *              responsabilidad es renderizar el `Suspense boundary` y el cargador de datos.
 * @author Raz Podestá
 * @version 1.0.0
 */
import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import CampaignsPageSkeleton from "./loading";
import { CampaignsPageLoader } from "./sites-page-loader";

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
