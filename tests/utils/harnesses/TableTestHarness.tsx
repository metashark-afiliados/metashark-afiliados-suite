// tests/utils/harnesses/TableTestHarness.tsx
/**
 * @file tests/utils/harnesses/TableTestHarness.tsx
 * @description Aparato de arnés de pruebas reutilizable y agnóstico.
 *              Su única responsabilidad es renderizar una estructura de tabla
 *              funcional (`<table>`) usando `@tanstack/react-table` para cualquier
 *              conjunto de datos y definiciones de columna.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import React from "react";

interface TableTestHarnessProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
}

export function TableTestHarness<TData>({
  data,
  columns,
}: TableTestHarnessProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
