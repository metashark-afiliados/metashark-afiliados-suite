// src/components/builder/SiteSelector.tsx
/**
 * @file SiteSelector.tsx
 * @description Componente de presentación puro que renderiza el selector de
 *              sitios. Refactorizado a un componente soberano que consume sus
 *              propias traducciones.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { Loader2, PlusCircle } from "lucide-react";

import { type SiteBasicInfo } from "@/lib/data/sites";
import { useTypedTranslations } from "@/lib/i18n/hooks";
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
}

export function SiteSelector({
  sites,
  selectedSiteId,
  onSiteSelect,
  onAssign,
  onCreateNew,
  isPending,
  isAssigning,
}: SiteSelectorProps) {
  const t = useTypedTranslations("components.builder.SiteAssignmentControl");
  const tSitesPage = useTypedTranslations("components.sites.SitesHeader");

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={onSiteSelect}
        value={selectedSiteId}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder={t("select_placeholder")} />
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
            {tSitesPage("createSiteButton")}
          </div>
        </SelectContent>
      </Select>
      <Button onClick={onAssign} disabled={isPending || !selectedSiteId}>
        {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("assign_button")}
      </Button>
    </div>
  );
}
// src/components/builder/SiteSelector.tsx
