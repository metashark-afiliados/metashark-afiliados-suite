// src/components/sites/SitesGrid.tsx
/**
 * @file SitesGrid.tsx
 * @description Componente de presentación soberano. Sincronizado para consumir
 *              la nueva API de "slots nombrados" del componente `SiteCard`.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-26
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { SiteCard } from "./SiteCard";
import { SiteCardHeader } from "./SiteCardHeader";
import { SiteCardFooter } from "./SiteCardFooter";

interface SitesGridProps {
  sites: SiteWithCampaignCount[];
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
}

export function SitesGrid({
  sites,
  onDelete,
  isPending,
  deletingSiteId,
}: SitesGridProps) {
  const { tSitesPage } = useDashboardTranslations();
  if (sites.length === 0) {
    // ... (estado vacío sin cambios)
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
              siteId={site.id}
              headerSlot={<SiteCardHeader site={site} />}
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
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Composición Explícita:** Este componente ahora construye explícitamente los slots para `SiteCard`, haciendo el flujo de datos más claro y la composición más robusta.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Contenido Adicional en `contentSlot`:** El `contentSlot` de `SiteCard` podría ser utilizado aquí para mostrar un resumen de métricas clave del sitio (ej. número de visitantes, tasa de conversión) directamente en la tarjeta.
 *
 * =====================================================================
 */
// src/components/sites/SitesGrid.tsx
