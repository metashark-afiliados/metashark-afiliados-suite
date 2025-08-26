// src/components/sites/SiteCardHeader.tsx
/**
 * @file SiteCardHeader.tsx
 * @description Componente de presentación soberano que consume sus propias
 *              traducciones para renderizar el encabezado de una tarjeta de sitio.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader as CardHeaderPrimitive,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboardTranslations } from "@/lib/hooks/useDashboardTranslations";
import { type SiteWithCampaignCount } from "@/lib/data/sites";
import { clientLogger } from "@/lib/logging";

interface SiteCardHeaderProps {
  site: SiteWithCampaignCount;
}

export function SiteCardHeader({ site }: SiteCardHeaderProps) {
  clientLogger.trace(`[SiteCardHeader] Renderizando para sitio: ${site.id}`);
  const { tSitesPage } = useDashboardTranslations();

  return (
    <CardHeaderPrimitive>
      <div className="flex justify-between items-start">
        <CardTitle className="truncate">{site.name}</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0"
              aria-label={tSitesPage("card.popoverTitle")}
            >
              <Info className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <h4 className="font-semibold">{tSitesPage("card.popoverTitle")}</h4>
            <p className="text-sm text-muted-foreground">
              {tSitesPage("card.popoverDescription")}
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <CardDescription>
        {tSitesPage("card.campaignCount", { count: site.campaign_count })}
      </CardDescription>
    </CardHeaderPrimitive>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Soberanía de i18n:** El componente ahora consume `useDashboardTranslations` internamente, eliminando la necesidad de pasar textos como props. Esto simplifica su API y lo alinea con la arquitectura de élite.
 * 2. ((Implementada)) **Full Observabilidad:** Se ha añadido `clientLogger.trace` para registrar su renderizado, mejorando la visibilidad del ciclo de vida de la UI.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Contenido de Popover Dinámico:** Para una UX más rica, el popover podría mostrar datos dinámicos del sitio, como la fecha de creación o el número de visitantes. Esto requeriría pasar el objeto `site` completo al `PopoverContent`.
 * 2. ((Vigente)) **Componente `InfoPopover` Reutilizable:** El patrón `Popover` con un icono de `Info` es muy común. Podría ser abstraído a un componente genérico `InfoPopover` que acepte `title` y `description` como props para un mayor cumplimiento del principio DRY.
 *
 * =====================================================================
 */
// src/components/sites/SiteCardHeader.tsx
