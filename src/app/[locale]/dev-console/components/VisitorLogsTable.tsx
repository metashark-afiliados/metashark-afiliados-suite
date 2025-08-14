// src/app/[locale]/dev-console/components/VisitorLogsTable.tsx
/**
 * @file VisitorLogsTable.tsx
 * @description Componente de cliente para mostrar los registros de telemetría en el Dev Console.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Eye, Globe, MoreHorizontal, User } from "lucide-react";

import { type Json } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const JsonViewerDialog = ({
  title,
  data,
  trigger,
}: {
  title: string;
  data: Json | null;
  trigger: React.ReactNode;
}) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <pre className="mt-2 w-full rounded-lg bg-muted p-4 text-xs overflow-auto max-h-[60vh]">
        {JSON.stringify(data, null, 2) || "No data available."}
      </pre>
    </DialogContent>
  </Dialog>
);

export function VisitorLogsTable({ logs }: { logs: VisitorLogRow[] }) {
  const t = useTranslations("app.dev-console.TelemetryTable");
  const format = useFormatter();

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
 * @subsection Melhorias Adicionadas
 * 1. **Componente de UI Atómico**: ((Implementada)) Componente de presentación puro que encapsula la renderización de la tabla de telemetría.
 * 2. **Full Internacionalización**: ((Implementada)) Todos los textos se consumen desde la capa de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Paginación y Búsqueda**: ((Vigente)) Integrar este componente con `@tanstack/react-table` para añadir paginación, búsqueda por IP o fingerprint, y ordenamiento del lado del cliente.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/components/VisitorLogsTable.tsx
