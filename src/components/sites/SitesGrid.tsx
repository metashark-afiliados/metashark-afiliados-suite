// src/components/sites/SitesGrid.tsx
/**
 * @file SitesGrid.tsx
 * @description Componente de presentación soberano y de alto rendimiento. Ha sido
 *              refactorizado a un estándar de élite para implementar virtualización
 *              de cuadrícula con `@tanstack/react-virtual`, garantizando una
 *              renderización óptima a cualquier escala.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Card } from "@/components/ui/card";
import { type SiteWithCampaignCount } from "@/lib/data/sites/types";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { clientLogger } from "@/lib/logging";
import { SiteCard } from "./SiteCard";
import { SiteCardFooter } from "./SiteCardFooter";
import { SiteCardHeader } from "./SiteCardHeader";

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
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const scroller = document.getElementById("main-content-scroller");
    setScrollElement(scroller);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(sites.length / 3), // Número de filas (3 columnas)
    getScrollElement: () => scrollElement,
    estimateSize: () => 176, // Altura estimada de una fila (160px card + 16px gap)
    overscan: 5,
  });

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
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Virtualización de Cuadrícula de Alto Rendimiento**: ((Implementada)) El componente ahora utiliza `useVirtualizer` para renderizar solo las filas de tarjetas que están visibles en el viewport. Esto garantiza un rendimiento de renderizado instantáneo y un uso de memoria bajo, sin importar si hay 10 o 10,000 sitios.
 * 2. **Integración con Anclaje de DOM**: ((Implementada)) La virtualización se integra con el `id="main-content-scroller"` del layout principal a través de `getScrollElement`, demostrando el éxito de la refactorización arquitectónica desacoplada.
 *
 * @subsection Melhorias Futuras
 * 1. **Estimación de Altura Dinámica**: ((Vigente)) La `estimateSize` es actualmente un valor fijo. Para una precisión de scroll de élite, se podría usar una librería como `react-measure` para medir dinámicamente la altura real de las filas y alimentar al virtualizador.
 *
 * =====================================================================
 */
// src/components/sites/SitesGrid.tsx
