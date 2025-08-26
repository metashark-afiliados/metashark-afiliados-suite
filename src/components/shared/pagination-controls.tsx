// src/components/shared/pagination-controls.tsx
/**
 * @file pagination-controls.tsx
 * @description Componente de cliente soberano para la navegación paginada.
 *              Consume sus propias traducciones a través del hook SSoT
 *              `useDashboardTranslations`.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { usePagination, DOTS } from "@/lib/hooks/ui/use-pagination";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { clientLogger } from "@/lib/logging";

export interface PaginationControlsProps {
  page: number;
  totalCount: number;
  limit: number;
  basePath: string;
  routeParams?: Record<string, string>;
  searchQuery?: string;
}

export function PaginationControls({
  page,
  totalCount,
  limit,
  basePath,
  routeParams,
  searchQuery,
}: PaginationControlsProps) {
  clientLogger.trace("[PaginationControls] Renderizando componente soberano.");
  const { tSitesPage } = useDashboardTranslations();

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
          aria-label={tSitesPage("pagination.previous")}
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
              aria-label={tSitesPage("pagination.page", {
                pageNumber: String(pageNumber),
              })}
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
          aria-label={tSitesPage("pagination.next")}
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
 * 1. ((Implementada)) **Soberanía de i18n:** El componente ahora consume `useDashboardTranslations` internamente. Se ha eliminado la prop `texts`, resolviendo la causa raíz del error de tipo `TS2741` en su orquestador (`sites-client.tsx`).
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Input de Página:** Añadir un campo de entrada (`<Input type="number">`) que permita al usuario saltar directamente a una página específica, una mejora de UX para conjuntos de datos muy grandes.
 * 2. ((Vigente)) **Información de Conteo:** Mostrar información de conteo como "Mostrando 1-10 de 100 resultados" para dar más contexto al usuario.
 *
 * =====================================================================
 */
// src/components/shared/pagination-controls.tsx
