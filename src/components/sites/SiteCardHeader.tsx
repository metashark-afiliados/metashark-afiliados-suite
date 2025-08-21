// src/components/sites/SiteCardHeader.tsx
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

export interface SiteCardHeaderProps {
  name: string;
  campaignCountText: string;
  popoverTitle: string;
  popoverDescription: string;
}

/**
 * @public
 * @component SiteCardHeader
 * @description Componente de presentación puro que renderiza el encabezado
 *              de una tarjeta de sitio, incluyendo el popover de información.
 * @param {SiteCardHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 * @version 1.0.0
 * @author Raz Podestá
 */
export function SiteCardHeader({
  name,
  campaignCountText,
  popoverTitle,
  popoverDescription,
}: SiteCardHeaderProps): React.ReactElement {
  return (
    <CardHeaderPrimitive>
      <div className="flex justify-between items-start">
        <CardTitle className="truncate">{name}</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0"
            >
              <Info className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <h4 className="font-semibold">{popoverTitle}</h4>
            <p className="text-sm text-muted-foreground">
              {popoverDescription}
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <CardDescription>{campaignCountText}</CardDescription>
    </CardHeaderPrimitive>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Este componente aísla perfectamente la UI del encabezado de la tarjeta.
 *
 * @subsection Melhorias Futuras
 * 1. **Contenido Dinámico del Popover**: ((Vigente)) El popover podría renderizar `children` pasados como prop para mostrar contenido más complejo.
 *
 * =====================================================================
 */
