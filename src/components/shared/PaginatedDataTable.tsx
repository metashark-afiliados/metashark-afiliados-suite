// src/components/shared/PaginatedDataTable.tsx
/**
 * @file PaginatedDataTable.tsx
 * @description Aparato de UI genérico y de élite. Encapsula el patrón de
 *              composición de `DataTable` con `PaginationControls`, adhiriéndose
 *              estrictamente al principio DRY y proporcionando una API de alto
 *              nivel para renderizar cualquier vista de datos paginada.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";

/**
 * @public
 * @interface PaginatedDataTableProps
 * @description Contrato de props genérico para el componente.
 * @template TData - El tipo de los datos de cada fila.
 */
export interface PaginatedDataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  noResultsText: string;
  page: number;
  totalCount: number;
  limit: number;
  basePath: string;
  searchQuery?: string;
}

/**
 * @public
 * @component PaginatedDataTable
 * @description Renderiza una tabla de datos con sus controles de paginación.
 * @template TData - El tipo de los datos de cada fila.
 * @param {PaginatedDataTableProps<TData>} props - Propiedades del componente.
 * @returns {React.ReactElement} El componente de tabla paginada.
 */
export function PaginatedDataTable<TData>({
  columns,
  data,
  noResultsText,
  page,
  totalCount,
  limit,
  basePath,
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
      />
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Abstracción Arquitectónica (DRY)**: ((Implementada)) Este nuevo componente encapsula un patrón de UI repetido, eliminando la duplicación de código en `users-client.tsx` y otros futuros componentes.
 * 2. **API Genérica y Tipo-Segura**: ((Implementada)) El componente utiliza genéricos (`<TData>`) para ser completamente agnóstico al tipo de datos, garantizando al mismo tiempo la seguridad de tipos.
 *
 * @subsection Melhorias Futuras
 * 1. **Render Props para Layout**: ((Vigente)) Para una flexibilidad de élite, el componente podría aceptar una `render` prop (`render={(table, pagination) => ...}`) que permita al consumidor controlar el layout exacto (ej. poner la paginación encima de la tabla).
 *
 * =====================================================================
 */
// src/components/shared/PaginatedDataTable.tsx
