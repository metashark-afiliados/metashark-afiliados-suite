// src/components/sites/SitesGrid.tsx
/**
 * @file src/components/sites/SitesGrid.tsx
 * @description Componente de presentación puro responsable de renderizar la
 *              cuadrícula de sitios o un estado vacío. Utiliza `framer-motion`
 *              para animar la entrada y salida de los elementos, proporcionando
 *              una experiencia de usuario fluida y de élite.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { type SiteWithCampaignCount } from "@/lib/data/sites";

import {
  type DeleteSiteDialogTexts,
  SiteCard,
  type SiteCardTexts,
} from "./SiteCard";

export interface SitesGridTexts {
  emptyStateTitle: string;
  emptyStateDescription: string;
}

interface SitesGridProps {
  sites: SiteWithCampaignCount[];
  onDelete: (formData: FormData) => void;
  isPending: boolean;
  deletingSiteId: string | null;
  texts: SitesGridTexts;
  cardTexts: SiteCardTexts;
  deleteDialogTexts: DeleteSiteDialogTexts;
}

/**
 * @public
 * @component SitesGrid
 * @description Renderiza una cuadrícula animada de componentes `SiteCard` o un
 *              mensaje de estado vacío si no se proporcionan sitios.
 * @param {SitesGridProps} props - Las propiedades para configurar la cuadrícula.
 * @returns {React.ReactElement}
 */
export function SitesGrid({
  sites,
  onDelete,
  isPending,
  deletingSiteId,
  texts,
  cardTexts,
  deleteDialogTexts,
}: SitesGridProps): React.ReactElement {
  if (sites.length === 0) {
    return (
      <Card className="flex h-64 flex-col items-center justify-center p-8 text-center border-dashed">
        <h3 className="text-xl font-semibold">{texts.emptyStateTitle}</h3>
        <p className="mt-2 text-muted-foreground">
          {texts.emptyStateDescription}
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
              texts={cardTexts}
              deleteDialogTexts={deleteDialogTexts}
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
 * @subsection Melhorias Futuras
 * 1. **Virtualización de Cuadrícula**: ((Vigente)) Para workspaces con un número extremadamente grande de sitios (cientos o miles), se podría implementar la virtualización de la cuadrícula utilizando `@tanstack/react-virtual` para garantizar un rendimiento de renderizado óptimo.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia Final**: ((Implementada)) La reconstrucción de este aparato resuelve el último error `TS2307` en `sites-client.tsx`, completando la página.
 * 2. **Animaciones Fluidas**: ((Implementada)) El uso de `AnimatePresence` y `motion.div` de `framer-motion` para la renderización de la cuadrícula proporciona una experiencia de usuario de élite, con animaciones suaves al añadir o eliminar sitios.
 *
 * =====================================================================
 */
// src/components/sites/SitesGrid.tsx
