/**
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Eye, Globe, MoreHorizontal, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clientLogger } from "@/lib/logging";
import { type Json } from "@/lib/types/database";
import { JsonViewerDialog } from "@/components/dev-console/components/JsonViewerDialog";

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
 * @description Renderiza una tabla que muestra los logs de visitantes. Ha sido refactorizado
 *              para consumir el `JsonViewerDialog` atómico y corregir sus importaciones.
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
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación y Búsqueda**: ((Vigente)) Integrar este componente con `@tanstack/react-table` para añadir paginación, búsqueda por IP o fingerprint, y ordenamiento del lado del cliente.
 * 2. **Estado Vacío Dinámico**: ((Vigente)) El `empty_state` es actualmente una simple cadena de texto. Podría ser un `React.ReactNode` para permitir un componente de estado vacío más rico (ej. con un botón para refrescar).
 * 3. **Visualización de Geo Datos Mejorada**: ((Vigente)) En lugar de mostrar solo `city` y `country`, se podría renderizar un pequeño mapa estático o un enlace a Google Maps utilizando las coordenadas de `geo_data`.
 *
 * =====================================================================
 */
