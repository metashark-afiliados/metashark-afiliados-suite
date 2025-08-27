// src/app/[locale]/dev-console/telemetry/page.tsx
/**
 * @file page.tsx
 * @description Página del Visor de Telemetría. Ha sido refactorizada a un estándar
 *              de élite para alinearse con la nueva API soberana del componente
 *              `PaginationControls`, resolviendo el error de compilación TS2322.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
        {/* --- INICIO DE CORRECCIÓN DE API (TS2322) --- */}
        <PaginationControls
          page={page}
          totalCount={count ?? 0}
          limit={LOGS_PER_PAGE}
          basePath="/dev-console/telemetry"
        />
        {/* --- FIN DE CORRECCIÓN DE API (TS2322) --- */}
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
 * 1. **Resolución de Error de Compilación (TS2322)**: ((Implementada)) Se ha eliminado la prop `texts` de la invocación de `PaginationControls`. Esta corrección alinea este componente con la nueva arquitectura de componentes soberanos, donde `PaginationControls` es ahora responsable de consumir sus propias traducciones.
 * 2. **Sincronización Arquitectónica**: ((Implementada)) Esta refactorización refuerza la arquitectura de componentes soberanos y desacoplados, mejorando la mantenibilidad y el cumplimiento del SRP.
 *
 * @subsection Melhorias Futuras
 * 1. **Filtros Avanzados**: ((Vigente)) Añadir `searchParams` para filtrar los logs por `ip_address`, `user_id` o `fingerprint`.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/telemetry/page.tsx
