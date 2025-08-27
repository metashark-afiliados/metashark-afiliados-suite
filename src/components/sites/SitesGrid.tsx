// src/components/sites/SitesGrid.tsx
/**
 * @file SitesGrid.tsx
 * @description Componente de presentación soberano y memoizado.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-26
 */
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { SiteCard } from "./SiteCard";

interface SitesGridProps {
  sites: SiteWithCampaignCount[];
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
}

const SitesGridComponent = ({
  sites,
  onDelete,
  isPending,
  deletingSiteId,
}: SitesGridProps) => {
  const { tSitesPage } = useDashboardTranslations();
  if (sites.length === 0) {
    return (
      <Card className="flex h-64 flex-col items-center justify-center p-8 text-center border-dashed">
        <h3 className="text-xl font-semibold">
          {tSitesPage("grid.emptyStateTitle")}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {tSitesPage("grid.emptyStateDescription")}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {sites.map((site) => (
          <motion.div
            key={site.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <SiteCard
              site={site}
              onDelete={onDelete}
              isPending={isPending}
              deletingSiteId={deletingSiteId}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const SitesGrid = React.memo(SitesGridComponent);
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Memoización de Rendimiento:** El componente ahora está envuelto en `React.memo`, una optimización de élite que previene re-renderizados innecesarios cuando el estado del orquestador padre cambia (ej. al abrir un diálogo).
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Virtualización de Cuadrícula:** Para workspaces con cientos de sitios, la siguiente optimización es implementar `@tanstack/react-virtual` para garantizar un rendimiento de renderizado óptimo a cualquier escala.
 *
 * =====================================================================
 */
// src/components/sites/SitesGrid.tsx
