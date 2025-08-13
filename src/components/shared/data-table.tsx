/**
 * @file src/components/shared/data-table.tsx
 * @description Componente de presentación de élite, genérico y sin estado (`headless`)
 *              para renderizar datos tabulares. Utiliza `@tanstack/react-table` para
 *              la lógica del núcleo y compone los primitivos de UI de Shadcn para la
 *              renderización, adhiriéndose a la filosofía de composición atómica.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type Header,
  type HeaderGroup,
  type Row,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * @public
 * @interface DataTableProps
 * @description Contrato de props para el componente DataTable.
 * @template TData - El tipo de los datos de cada fila.
 */
export interface DataTableProps<TData> {
  /**
   * La definición de las columnas para la tabla. Este es el "manual de instrucciones"
   * que le dice a la tabla qué cabeceras renderizar y cómo renderizar el contenido de
   * cada celda, permitiendo la inyección de JSX personalizado.
   */
  columns: ColumnDef<TData>[];
  /** El array de datos a renderizar en la tabla. */
  data: TData[];
  /**
   * Texto a mostrar cuando no hay datos. Este texto debe ser internacionalizado
   * por el componente padre (orquestador) antes de ser pasado a esta prop.
   */
  noResultsText: string;
}

/**
 * @public
 * @exports DataTable
 * @description Renderiza una tabla genérica y accesible.
 * @component
 * @template TData - El tipo de los datos de cada fila.
 * @param {DataTableProps<TData>} props - Las propiedades del componente.
 * @returns {React.ReactElement} El componente de tabla renderizado.
 */
export function DataTable<TData>({
  columns,
  data,
  noResultsText,
}: DataTableProps<TData>): React.ReactElement {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: Header<TData, unknown>) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: Row<TData>) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {noResultsText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fundación de UI de Datos**: ((Implementada)) Este aparato reconstruye el componente genérico para mostrar datos tabulares, un bloque de construcción esencial para el resto del flujo de "Campaign Management".
 * 2. **Cero Regresiones**: ((Implementada)) La implementación es una transcripción de alta fidelidad de la versión del snapshot primitivo, garantizando su robustez y compatibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Virtualización de Filas**: ((Vigente)) Para tablas con miles de registros, la mejora de élite es integrar `@tanstack/react-virtual` para renderizar solo las filas visibles, garantizando un rendimiento constante a cualquier escala.
 *
 * =====================================================================
 */
