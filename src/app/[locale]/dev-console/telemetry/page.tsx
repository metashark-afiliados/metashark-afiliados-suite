// src/app/[locale]/dev-console/telemetry/page.tsx
/**
 * @file page.tsx
 * @description Página del Visor de Telemetría. Ha sido refactorizado a un
 *              estándar de élite para alinear el logging con la Constitución
 *              y para inyectar los textos de paginación requeridos.
 * @author L.I.A. Legacy
 * @version 4.0.0
 * @see .docs-espejo/app/[locale]/dev-console/telemetry/page.tsx.md
 */
import { AlertTriangle } from "lucide-react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { ErrorStateCard } from "@/components/shared/error-state-card";
import {
  PaginationControls,
  type PaginationTexts,
} from "@/components/shared/pagination-controls";
import { admin as adminData } from "@/lib/data";
import { logger } from "@/lib/logger";
import {
  VisitorLogsTable,
  type VisitorLogRow,
} from "../components/VisitorLogsTable";

const LOGS_PER_PAGE = 25;

export default async function TelemetryPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("app.dev-console.TelemetryTable");
  const page = Number(searchParams.page) || 1;

  try {
    const { logs: rawLogs, totalCount } =
      await adminData.telemetry.getVisitorLogs({
        page,
        limit: LOGS_PER_PAGE,
      });

    // Adaptación de datos para el contrato de la tabla
    const logs: VisitorLogRow[] = (rawLogs || []).map((log) => ({
      ...log,
      ip_address: String(log.ip_address || "N/A"),
    }));

    const paginationTexts: PaginationTexts = {
      previous: t("pagination.previousPageLabel"),
      next: t("pagination.nextPageLabel"),
      page: t("pagination.pageLabelTemplate"),
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <VisitorLogsTable logs={logs} />
        <PaginationControls
          page={page}
          totalCount={totalCount ?? 0}
          limit={LOGS_PER_PAGE}
          basePath="/dev-console/telemetry"
          texts={paginationTexts}
        />
      </div>
    );
  } catch (error) {
    logger.error(
      { err: error as Error },
      "[DevConsole:TelemetryPage] Error al cargar los logs de visitantes."
    );
    return (
      <ErrorStateCard
        icon={AlertTriangle}
        title={t("error_title")}
        description={t("error_description")}
      />
    );
  }
}
// src/app/[locale]/dev-console/telemetry/page.tsx
