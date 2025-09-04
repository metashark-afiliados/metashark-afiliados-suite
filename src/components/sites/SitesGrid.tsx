// src/components/sites/SitesGrid.tsx
/**
 * @file SitesGrid.tsx
 * @description Componente de presentación soberano y de alto rendimiento. Ha sido
 *              refactorizado a un estándar de élite para implementar virtualización
 *              de cuadrícula con `@tanstack/react-virtual`, garantizando una
 *              renderización óptima a cualquier escala.
 *              **Actualizado para propagar `handleUpdateSiteName` y el estado optimista de edición.**
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { Card } from "@/components/ui/card";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { useSitesPageTranslations } from "@/lib/hooks/i18n/useSitesPageTranslations";
import { clientLogger } from "@/lib/logger";
import { SiteCard } from "./SiteCard";
import { SiteCardFooter } from "./SiteCardFooter";
import { SiteCardHeader } from "./SiteCardHeader";

export interface SitesGridProps {
  sites: SiteWithCampaignCount[];
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
  handleUpdateSiteName: (siteId: string, newName: string) => Promise<void>;
  isUpdatingName: boolean;
  updatingSiteNameId: string | null;
}

const SitesGridComponent = ({
  sites,
  onDelete,
  isPending,
  deletingSiteId,
  handleUpdateSiteName,
  isUpdatingName,
  updatingSiteNameId,
}: SitesGridProps) => {
  const { tSitesPage } = useSitesPageTranslations();
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const scroller = document.getElementById("main-content-scroller");
    setScrollElement(scroller);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(sites.length / 3),
    getScrollElement: () => scrollElement,
    estimateSize: () => 176,
    overscan: 5,
  });

  clientLogger.trace(
    "[SitesGrid] Renderizando cuadrícula virtualizada de sitios.",
    {
      totalSites: sites.length,
      isPending,
      deletingSiteId,
      isUpdatingName,
      updatingSiteNameId,
    }
  );

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
    <div
      ref={parentRef}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const startIndex = virtualRow.index * 3;
        const endIndex = Math.min(startIndex + 3, sites.length);
        const rowItems = sites.slice(startIndex, endIndex);

        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {rowItems.map((site) => (
                <motion.div
                  key={site.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <SiteCard
                    siteId={site.id}
                    headerSlot={
                      <SiteCardHeader
                        site={site}
                        onDelete={onDelete}
                        isPending={isPending}
                        deletingSiteId={deletingSiteId}
                        handleUpdateSiteName={handleUpdateSiteName}
                        isUpdatingName={isUpdatingName}
                        updatingSiteNameId={updatingSiteNameId}
                      />
                    }
                    footerSlot={
                      <SiteCardFooter
                        site={site}
                        onDelete={onDelete}
                        isPending={isPending}
                        deletingSiteId={deletingSiteId}
                      />
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export const SitesGrid = React.memo(SitesGridComponent);
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Novas
 * 1. **Estimación de Altura Dinámica**: ((Vigente)) La `estimateSize` es actualmente un valor fijo. Para una precisión de scroll de élite, se podría usar una librería como `react-measure` para medir dinámicamente la altura real de las filas y alimentar al virtualizador.
 * 2. **Virtualización de Columnas**: ((Vigente)) Para vistas extremadamente anchas o dinámicas, se podría implementar un `columnVirtualizer` anidado para virtualizar también las columnas, aunque para el caso de 3 columnas fijas no es necesario.
 *
 * =====================================================================
 */
// src/components/sites/SitesGrid.tsx
