// src/components/shared/pagination-controls.tsx
/**
 * @file src/components/shared/pagination-controls.tsx
 * @description Componente de cliente atómico y reutilizable para la navegación
 *              paginada. Es un componente de presentación puro, completamente
 *              controlado por props, que construye dinámicamente los enlaces
 *              de paginación.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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

const DOTS = "...";

const usePaginationRange = (
  totalPages: number,
  currentPage: number,
  siblingCount: number = 1
): (string | number)[] => {
  return useMemo(() => {
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, DOTS, ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, DOTS, ...middleRange, DOTS, totalPages];
    }
    return []; // Should be unreachable
  }, [totalPages, currentPage, siblingCount]);
};

export function PaginationControls({
  page,
  totalCount,
  limit,
  basePath,
  routeParams,
  searchQuery,
  texts,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalCount / limit);
  const paginationRange = usePaginationRange(totalPages, page);

  if (totalPages <= 1) {
    return null;
  }

  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

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
 * @subsection Melhorias Futuras
 * 1. **Componente de Selección de Límite**: ((Vigente)) Añadir un `<Select>` que permita al usuario cambiar el número de ítems por página (`limit`), actualizando la URL y re-obteniendo los datos.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia**: ((Implementada)) La reconstrucción de este aparato resuelve el error `TS2307` en `sites-client.tsx`.
 * 2. **Componente de UI Reutilizable**: ((Implementada)) Proporciona una solución de paginación genérica y robusta para todas las tablas y cuadrículas de datos de la aplicación.
 * 3. **Lógica de Rango Inteligente**: ((Implementada)) El hook `usePaginationRange` implementa una lógica de élite para mostrar los números de página y los puntos suspensivos, asegurando una UX óptima incluso con un gran número de páginas.
 *
 * =====================================================================
 */
// src/components/shared/pagination-controls.tsx
