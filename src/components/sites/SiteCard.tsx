// src/components/sites/SiteCard.tsx
/**
 * @file SiteCard.tsx
 * @description Orquestador de UI. Refactorizado a una plantilla de composición
 *              de élite que utiliza el patrón de "slots nombrados" para una
 *              máxima flexibilidad y control.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.0.0
 * @date 2025-08-26
 */
import React from "react";

import { CardContent, Card as CardPrimitive } from "@/components/ui/card";
import { clientLogger } from "@/lib/logger";

interface SiteCardProps {
  headerSlot: React.ReactNode;
  footerSlot: React.ReactNode;
  contentSlot?: React.ReactNode;
  siteId: string;
}

export function SiteCard({
  headerSlot,
  footerSlot,
  contentSlot,
  siteId,
}: SiteCardProps): React.ReactElement {
  clientLogger.trace(`[SiteCard] Renderizando tarjeta para sitio: ${siteId}`);
  return (
    <CardPrimitive className="flex flex-col justify-between h-full transition-all hover:border-primary/50 hover:shadow-lg">
      <div>
        {headerSlot}
        {contentSlot && <CardContent>{contentSlot}</CardContent>}
      </div>
      {footerSlot}
    </CardPrimitive>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Arquitectura de Slots Nombrados:** El componente ahora utiliza un patrón de composición de élite, proporcionando una API declarativa y flexible.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Animación de Hover en Slots:** Los slots podrían recibir props adicionales (ej. `isHovering`) para que su contenido interno pueda reaccionar a las interacciones del usuario en la tarjeta principal.
 *
 * =====================================================================
 */
// src/components/sites/SiteCard.tsx
