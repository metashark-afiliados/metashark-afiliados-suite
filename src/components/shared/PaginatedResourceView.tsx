// src/components/shared/PaginatedResourceView.tsx
/**
 * @file PaginatedResourceView.tsx
 * @description Aparato de UI de layout, genérico y de élite. Ha sido
 *              refactorizado para aceptar y propagar los textos de paginación
 *              a su hijo `PaginationControls`, resolviendo el error TS2741.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-31
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import {
  PaginationControls,
  type PaginationTexts,
} from "@/components/shared/pagination-controls";
import { Card } from "@/components/ui/card";
import { clientLogger } from "@/lib/logger";

export interface PaginatedResourceViewProps<T> {
  viewKey: string;
  items: T[];
  emptyStateText: string;
  page: number;
  totalCount: number;
  limit: number;
  basePath: string;
  paginationTexts: PaginationTexts; // <-- NUEVA PROP
  searchQuery?: string;
  renderView: (items: T[]) => React.ReactNode;
}

export function PaginatedResourceView<T>({
  viewKey,
  items,
  emptyStateText,
  page,
  totalCount,
  limit,
  basePath,
  paginationTexts, // <-- NUEVA PROP
  searchQuery,
  renderView,
}: PaginatedResourceViewProps<T>): React.ReactElement {
  clientLogger.trace(
    "[PaginatedResourceView] Renderizando vista de recursos paginada.",
    { viewKey, itemCount: items.length }
  );

  return (
    <>
      {items.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderView(items)}
          </motion.div>
        </AnimatePresence>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center p-8 text-center border-dashed">
          <h3 className="text-xl font-semibold">{emptyStateText}</h3>
        </Card>
      )}

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
// src/components/shared/PaginatedResourceView.tsx
