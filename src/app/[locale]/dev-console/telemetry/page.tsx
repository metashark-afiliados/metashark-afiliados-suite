// src/app/[locale]/dev-console/telemetry/page.tsx
/**
 * @file page.tsx
 * @description Página del Visor de Telemetría en el Dev Console. Actúa como
 *              un Server Component para obtener los datos de los logs de visitantes
 *              y pasarlos al componente de cliente para su renderizado.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { AlertTriangle } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logging";
import { ErrorStateCard } from "@/components/shared/error-state-card";
import {
  VisitorLogsTable,
  type VisitorLogRow,
} from "../components/VisitorLogsTable";
import { PaginationControls } from "@/components/shared/pagination-controls";

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
          texts={{
            previousPageLabel: t("pagination.previousPageLabel"),
            nextPageLabel: t("pagination.nextPageLabel"),
            pageLabelTemplate: t("pagination.pageLabelTemplate"),
          }}
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

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura Servidor-Cliente**: ((Implementada)) Patrón de élite donde el Server Component maneja la carga de datos.
 * 2. **Paginación del Lado del Servidor**: ((Implementada)) Lógica de paginación robusta y performante.
 * 3. **Manejo de Errores Robusto**: ((Implementada)) Renderiza un estado de error claro si la capa de datos falla.
 *
 * @subsection Melhorias Futuras
 * 1. **Filtros Avanzados**: ((Vigente)) Añadir `searchParams` para filtrar los logs por `ip_address`, `user_id` o `fingerprint`.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/telemetry/page.tsx
