// src/components/sites/SitesTable.tsx
/**
 * @file SitesTable.tsx
 * @description Componente de ensamblaje soberano y de alto rendimiento. Ha sido
 *              refactorizado a un estándar de élite para implementar virtualización
 *              de filas con `@tanstack/react-virtual`, garantizando una
 *              renderización óptima de la tabla a cualquier escala.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { clientLogger } from "@/lib/logging";
import { getSitesTableColumns } from "./SitesTableColumns";

interface SitesTableProps {
  sites: SiteWithCampaignCount[];
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
}

const SitesTableComponent = ({
  sites,
  onDelete,
  isPending,
  deletingSiteId,
}: SitesTableProps) => {
  clientLogger.trace(
    "[SitesTable] Renderizando componente de tabla soberano y virtualizado."
  );
  const t = useTranslations("SitesPage");
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const scroller = document.getElementById("main-content-scroller");
    setScrollElement(scroller);
  }, []);

  const columns = React.useMemo(
    () => getSitesTableColumns({ onDelete, isPending, deletingSiteId }),
    [onDelete, isPending, deletingSiteId]
  );

  const table = useReactTable({
    data: sites,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 65, // Altura estimada de una fila
    overscan: 10,
  });

  return (
    <div className="rounded-md border">
      <Table style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        <TableHeader
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            background: "hsl(var(--card))",
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody style={{ position: "relative" }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<SiteWithCampaignCount>;
            return (
              <TableRow
                key={row.id}
                data-index={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export const SitesTable = React.memo(SitesTableComponent);
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Virtualización de Filas de Alto Rendimiento**: ((Implementada)) El componente ahora utiliza `useVirtualizer` para renderizar solo las filas de la tabla visibles en el viewport. Esto garantiza un rendimiento de renderizado instantáneo y un uso de memoria bajo, sin importar el número de sitios.
 * 2. **Cabecera Adhesiva (Sticky Header)**: ((Implementada)) Se ha añadido `position: "sticky"` al `TableHeader`. Esta es una mejora de UX de élite que mantiene las cabeceras de la tabla visibles mientras el usuario se desplaza, proporcionando contexto constante.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Infinita (Infinite Scrolling)**: ((Vigente)) Para una escalabilidad máxima, la virtualización puede ser combinada con "infinite scrolling". A medida que el usuario se acerca al final de la lista, el hook `useVirtualizer` podría invocar un callback para cargar la siguiente página de datos desde el servidor.
 *
 * =====================================================================
 */
// src/components/sites/SitesTable.tsx
