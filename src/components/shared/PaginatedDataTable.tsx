// src/components/shared/PaginatedDataTable.tsx
/**
 * @file PaginatedDataTable.tsx
 * @description Aparato de UI genérico y de élite. Ha sido refactorizado para
 *              aceptar y propagar las `props` de internacionalización a su
 *              hijo `PaginationControls`, completando el flujo de datos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-31
 */
"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/shared/data-table";
import {
  PaginationControls,
  type PaginationTexts,
} from "@/components/shared/pagination-controls";

export interface PaginatedDataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  noResultsText: string;
  page: number;
  totalCount: number;
  limit: number;
  basePath: string;
  paginationTexts: PaginationTexts; // <-- NUEVA PROP
  searchQuery?: string;
}

export function PaginatedDataTable<TData>({
  columns,
  data,
  noResultsText,
  page,
  totalCount,
  limit,
  basePath,
  paginationTexts, // <-- NUEVA PROP
  searchQuery,
}: PaginatedDataTableProps<TData>): React.ReactElement {
  return (
    <>
      <DataTable columns={columns} data={data} noResultsText={noResultsText} />
      <PaginationControls
        page={page}
        totalCount={totalCount}
        limit={limit}
        basePath={basePath}
        searchQuery={searchQuery}
        texts={paginationTexts} // <-- PROPAGACIÓN
      />
    </>
  );
}
// src/components/shared/PaginatedDataTable.tsx
