// src/components/builder/SiteSelector.tsx
/**
 * @file SiteSelector.tsx
 * @description Componente de presentación puro que renderiza el selector de
 *              sitios y el botón de asignación. Ha sido limpiado de caracteres
 *              anómalos, resolviendo el error de compilación TS2304.
 * @author Raz Podestá
 * @version 2.0.1
 * @date 2025-08-27
 */
"use client";

import { Loader2, PlusCircle } from "lucide-react";

import { type SiteBasicInfo } from "@/lib/data/sites";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SiteSelectorProps {
  sites: SiteBasicInfo[];
  selectedSiteId: string;
  onSiteSelect: (siteId: string) => void;
  onAssign: () => void;
  onCreateNew: () => void;
  isPending: boolean;
  isAssigning: boolean;
  texts: {
    select_placeholder: string;
    assign_button: string;
    createSiteButton: string;
  };
}

export function SiteSelector({
  sites,
  selectedSiteId,
  onSiteSelect,
  onAssign,
  onCreateNew,
  isPending,
  isAssigning,
  texts,
}: SiteSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={onSiteSelect}
        value={selectedSiteId}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder={texts.select_placeholder} />
        </SelectTrigger>
        <SelectContent>
          {sites.map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name} ({site.subdomain})
            </SelectItem>
          ))}
          <SelectSeparator />
          <div
            className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent"
            onSelect={(e) => {
              e.preventDefault();
              onCreateNew();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onCreateNew();
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {texts.createSiteButton}
          </div>
        </SelectContent>
      </Select>
      <Button onClick={onAssign} disabled={isPending || !selectedSiteId}>
        {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {texts.assign_button}
      </Button>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Error de Compilación (TS2304)**: Se ha eliminado el carácter anómalo 'o' al final del archivo, restaurando su integridad sintáctica y resolviendo el error de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Abstracción a `SelectItemButton`**: El patrón de tener un item no seleccionable que actúa como un botón dentro de un `Select` es reutilizable. Podría ser abstraído a su propio componente atómico para una mayor adhesión al principio DRY.
 *
 * =====================================================================
 */
// src/components/builder/SiteSelector.tsx
