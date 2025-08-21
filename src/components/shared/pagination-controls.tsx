// src/components/shared/pagination-controls.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePagination, DOTS } from "@/lib/hooks/ui/use-pagination";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface PaginationTexts {
  previousPageLabel: string;
  nextPageLabel: string;
  pageLabelTemplate: string;
}

export interface PaginationControlsProps {
  page: number;
  totalCount: number;
  limit: number;
  basePath: string;
  routeParams?: Record<string, string>;
  searchQuery?: string;
  texts: PaginationTexts;
}

/**
 * @public
 * @component PaginationControls
 * @description Componente de cliente de presentación puro para la navegación paginada.
 *              Consume el hook `usePagination` para la lógica y solo se encarga
 *              de renderizar la UI.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
export function PaginationControls({
  page,
  totalCount,
  limit,
  basePath,
  routeParams,
  searchQuery,
  texts,
}: PaginationControlsProps) {
  const { paginationRange, hasPreviousPage, hasNextPage } = usePagination({
    currentPage: page,
    totalCount,
    pageSize: limit,
  });

  if (page === 0 || paginationRange.length < 2) {
    return null;
  }

  const createPageLink = (pageNumber: number) => {
    const query: { page: string; q?: string } = {
      page: String(pageNumber),
    };
    if (searchQuery) {
      query.q = searchQuery;
    }
    return {
      pathname: basePath,
      params: routeParams,
      query,
    };
  };

  return (
    <div className="flex items-center justify-end gap-2 mt-8">
      <Button asChild variant="outline" size="icon" disabled={!hasPreviousPage}>
        <Link
          href={createPageLink(page - 1) as any}
          aria-label={texts.previousPageLabel}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <span key={`${pageNumber}-${index}`} className="px-2 py-1">
              …
            </span>
          );
        }
        return (
          <Button
            key={pageNumber}
            asChild
            variant={pageNumber === page ? "default" : "outline"}
            size="icon"
            className={cn(pageNumber === page && "pointer-events-none")}
          >
            <Link
              href={createPageLink(Number(pageNumber)) as any}
              aria-label={texts.pageLabelTemplate.replace(
                "{pageNumber}",
                String(pageNumber)
              )}
              aria-current={pageNumber === page ? "page" : undefined}
            >
              {pageNumber}
            </Link>
          </Button>
        );
      })}

      <Button asChild variant="outline" size="icon" disabled={!hasNextPage}>
        <Link
          href={createPageLink(page + 1) as any}
          aria-label={texts.nextPageLabel}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (Presentación Pura)**: ((Implementada)) El componente ahora solo se encarga de la renderización, delegando toda la lógica de cálculo al hook `usePagination`.
 *
 * =====================================================================
 */
