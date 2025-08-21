// src/lib/hooks/ui/use-pagination.ts
"use client";

import { useMemo } from "react";

export const DOTS = "...";

/**
 * @public
 * @function usePagination
 * @description Hook de lógica pura que encapsula el cálculo del rango de paginación.
 * @param {object} params - Parámetros de configuración.
 * @returns Un objeto con el rango de paginación y los estados derivados.
 * @version 1.0.0
 * @author Raz Podestá
 */
export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return Array.from({ length: totalPageCount }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPageCount - rightItemCount + i + 1
      );
      return [1, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, DOTS, ...middleRange, DOTS, totalPageCount];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < Math.ceil(totalCount / pageSize);

  return {
    paginationRange: paginationRange || [],
    hasPreviousPage,
    hasNextPage,
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (Lógica Pura)**: ((Implementada)) Este hook aísla completamente la lógica de cálculo de la paginación.
 *
 * =====================================================================
 */
