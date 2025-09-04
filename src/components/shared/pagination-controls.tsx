// src/components/shared/pagination-controls.tsx
/**
 * @file pagination-controls.tsx
 * @description Componente de cliente para la navegación paginada. Ha sido
 *              refactorizado a un componente de presentación 100% puro,
 *              recibiendo todos sus textos a través de props para una
 *              máxima reutilización y desacoplamiento.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-31
 */
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DOTS, usePagination } from "@/lib/hooks/ui/use-pagination";
import { clientLogger } from "@/lib/logger";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export interface PaginationTexts {
  previous: string;
  next: string;
  page: string; // e.g., "Go to page {pageNumber}"
}

export interface PaginationControlsProps {
  page: number;
  totalCount: number;
  limit: number;
  basePath: string;
  texts: PaginationTexts; // <-- Prop para textos
  routeParams?: Record<string, string>;
  searchQuery?: string;
}

export function PaginationControls({
  page,
  totalCount,
  limit,
  basePath,
  texts,
  routeParams,
  searchQuery,
}: PaginationControlsProps) {
  clientLogger.trace("[PaginationControls] Renderizando componente puro.");

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
    return { pathname: basePath, params: routeParams, query };
  };

  return (
    <div className="flex items-center justify-end gap-2 mt-8">
      <Button asChild variant="outline" size="icon" disabled={!hasPreviousPage}>
        <Link
          href={createPageLink(page - 1) as any}
          aria-label={texts.previous}
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
              aria-label={texts.page.replace(
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
        <Link href={createPageLink(page + 1) as any} aria-label={texts.next}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
// src/components/shared/pagination-controls.tsx
