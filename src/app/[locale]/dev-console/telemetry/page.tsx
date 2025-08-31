// src/app/[locale]/dev-console/telemetry/page.tsx
/**
 * @file page.tsx
 * @description Página del Visor de Telemetría. Ha sido refactorizada a un
 *              estándar de élite para obtener e inyectar los textos de
 *              paginación en su componente hijo, resolviendo el error de tipo TS2322.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-31
 */
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { AlertTriangle } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logging";
import { ErrorStateCard } from "@/components/shared/error-state-card";
import { PaginationControls } from "@/components/shared/pagination-controls";
import {
  VisitorLogsTable,
  type VisitorLogRow,
} from "../components/VisitorLogsTable";
import { type PaginationTexts } from "@/components/shared/pagination-controls";

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
  const supabase = createClient();
  const page = Number(searchParams.page) || 1;
  const from = (page - 1) * LOGS_PER_PAGE;
  const to = from + LOGS_PER_PAGE - 1;

  try {
    const {
      data: rawLogs,
      error,
      count,
    } = await supabase
      .from("visitor_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const logs: VisitorLogRow[] = (rawLogs || []).map((log) => ({
      ...log,
      ip_address: String(log.ip_address || "N/A"),
    }));

    // --- INICIO DE REFACTORIZACIÓN (CONSTRUCCIÓN DE PROPS I18N) ---
    const paginationTexts: PaginationTexts = {
      previous: t("pagination.previousPageLabel"),
      next: t("pagination.nextPageLabel"),
      page: t("pagination.pageLabelTemplate"),
    };
    // --- FIN DE REFACTORIZACIÓN ---

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <VisitorLogsTable logs={logs} />
        <PaginationControls
          page={page}
          totalCount={count ?? 0}
          limit={LOGS_PER_PAGE}
          basePath="/dev-console/telemetry"
          texts={paginationTexts} // <-- PROP INYECTADA
        />
      </div>
    );
  } catch (error) {
    logger.error(
      "[DevConsole:TelemetryPage] Error al cargar los logs de visitantes:",
      error instanceof Error ? error.message : String(error)
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
