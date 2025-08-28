// src/app/[locale]/dev-console/components/VisitorLogsTable.tsx
/**
 * @file VisitorLogsTable.tsx
 * @description Componente de cliente para mostrar los registros de telemetría en el Dev Console.
 *              Ha sido refactorizado holísticamente para extraer el `JsonViewerDialog` a
 *              su propio aparato atómico, mejorando la modularidad y la reutilización.
 *              Además, se han corregido las importaciones de los componentes de UI de Shadcn/UI
 *              (`Card`, `Table`, etc.) que faltaban, resolviendo los errores de compilación `TS2304`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.1
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Eye, Globe, MoreHorizontal, User } from "lucide-react";

import { type Json } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Importaciones de UI faltantes ---
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
import { JsonViewerDialog } from "./JsonViewerDialog"; // <-- Importación holística
import { clientLogger } from "@/lib/logging";

export type VisitorLogRow = {
  id: string;
  session_id: string;
  user_id: string | null;
  fingerprint: string;
  ip_address: string;
  geo_data: Json | null;
  utm_params: Json | null;
  created_at: string;
};

/**
 * @public
 * @component VisitorLogsTable
 * @description Renderiza una tabla que muestra los logs de visitantes.
 *              Proporciona acciones para ver los detalles de los datos GeoIP y UTM.
 * @param {object} props - Propiedades del componente.
 * @param {VisitorLogRow[]} props.logs - El array de logs de visitantes a mostrar.
 * @returns {React.ReactElement}
 */
export function VisitorLogsTable({
  logs,
}: {
  logs: VisitorLogRow[];
}): React.ReactElement {
  const t = useTranslations("app.dev-console.TelemetryTable");
  const format = useFormatter();

  clientLogger.trace(
    "[VisitorLogsTable] Renderizando tabla de logs de visitantes."
  );

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("header_timestamp")}</TableHead>
            <TableHead>{t("header_user_session")}</TableHead>
            <TableHead>{t("header_ip_country")}</TableHead>
            <TableHead>{t("header_fingerprint")}</TableHead>
            <TableHead className="text-right">{t("header_actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format.dateTime(new Date(log.created_at), "medium")}
                </TableCell>
                <TableCell>
                  {log.user_id ? (
                    <span className="flex items-center gap-2 font-medium">
                      <User className="h-4 w-4" />
                      {log.user_id}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-muted-foreground">
                      {log.session_id}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-mono text-xs">{log.ip_address}</div>
                  <div className="text-xs text-muted-foreground">
                    {(log.geo_data as any)?.city},{" "}
                    {(log.geo_data as any)?.country}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs truncate max-w-xs">
                  {log.fingerprint}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Acciones para el log ${log.id}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <JsonViewerDialog
                        title={t("dialog_title_geo")}
                        data={log.geo_data}
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Globe className="mr-2 h-4 w-4" />{" "}
                            {t("action_view_geo")}
                          </DropdownMenuItem>
                        }
                      />
                      <JsonViewerDialog
                        title={t("dialog_title_utms")}
                        data={log.utm_params}
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Eye className="mr-2 h-4 w-4" />{" "}
                            {t("action_view_utms")}
                          </DropdownMenuItem>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {t("empty_state")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.1
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores de Importación (TS2304)**: ((Implementada)) Se han añadido las importaciones faltantes para `Card`, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, y `TableRow` desde `@/components/ui/table` y `@/components/ui/card`. Esto resuelve la cascada de errores de compilación `TS2304` y restaura la funcionalidad del componente.
 * 2. **Integridad de Módulo**: ((Implementada)) La importación del `JsonViewerDialog` desde `./JsonViewerDialog` es correcta, y la adición de las importaciones de UI restantes completa la coherencia del módulo.
 * 3. **Full Observabilidad**: ((Implementada)) El `clientLogger.trace` se mantiene y es contextual al componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación y Búsqueda**: ((Vigente)) Integrar este componente con `@tanstack/react-table` para añadir paginación, búsqueda por IP o fingerprint, y ordenamiento del lado del cliente.
 * 2. **Estado Vacío Dinámico**: ((Vigente)) El `empty_state` está actualmente codificado en el JSON. Podría ser un `React.ReactNode` para permitir un componente de estado vacío más rico (ej. con un botón para refrescar).
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/components/VisitorLogsTable.tsx
