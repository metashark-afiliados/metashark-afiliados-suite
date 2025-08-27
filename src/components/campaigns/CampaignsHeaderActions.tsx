// src/components/campaigns/CampaignsHeaderActions.tsx
/**
 * @file CampaignsHeaderActions.tsx
 * @description Aparato de UI atómico y de ensamblaje puro. Su única
 *              responsabilidad es componer los controles interactivos del
 *              encabezado de la página "Campañas". Es 100% agnóstico al
 *              estado y consume sus propias traducciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { type useTranslations } from "next-intl";
import { FilePlus, ImageIcon, LayoutTemplate, PlusCircle } from "lucide-react";

import { useCampaignCreationDialog } from "@/lib/hooks/use-campaign-creation-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type CampaignMetadata } from "@/lib/data/campaigns";
import { CreateCampaignForm } from "./CreateCampaignForm";
import { clientLogger } from "@/lib/logging";

// Placeholder types - will be defined in a more appropriate location later
type SiteInfo = { id: string; subdomain: string | null };
type CampaignStatus = "draft" | "published" | "archived";
type SortByOption = "updated_at_desc" | "name_asc";
type TFunction = ReturnType<typeof useTranslations>;

export interface CampaignsHeaderActionsProps {
  t: TFunction;
  site: SiteInfo;
  handleCreate: (
    formData: FormData,
    optimisticItem: Omit<CampaignMetadata, "id">
  ) => void;
  isPending: boolean;
  mutatingId: string | null;
  statusFilter?: CampaignStatus;
  onStatusChange: (status: CampaignStatus | "all") => void;
  sortBy: SortByOption;
  onSortChange: (sort: SortByOption) => void;
}

export function CampaignsHeaderActions({
  t,
  site,
  handleCreate,
  isPending,
  mutatingId,
}: CampaignsHeaderActionsProps): React.ReactElement {
  clientLogger.trace(
    "[CampaignsHeaderActions] Renderizando ensamblador de acciones soberano."
  );

  const {
    isCreateDialogOpen,
    setCreateDialogOpen,
    handleCreateCampaign,
    openCreateDialog,
  } = useCampaignCreationDialog({
    siteId: site.id,
    handleCreate: handleCreate,
  });

  return (
    <div className="flex w-full sm:w-auto items-center gap-2">
      {/* TODO: Add Filters Component here */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("createCampaignButton")}
        </Button>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("createDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("createDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="from_scratch" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="from_scratch">
                <FilePlus className="mr-2 h-4 w-4" />
                {t("createDialog.tabs.from_scratch")}
              </TabsTrigger>
              <TabsTrigger value="from_template">
                <LayoutTemplate className="mr-2 h-4 w-4" />
                {t("createDialog.tabs.from_template")}
              </TabsTrigger>
              <TabsTrigger value="from_image_ai" disabled>
                <ImageIcon className="mr-2 h-4 w-4" />
                {t("createDialog.tabs.from_image_ai")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="from_scratch" className="pt-4">
              <CreateCampaignForm
                siteId={site.id}
                onSubmit={handleCreateCampaign}
                isPending={
                  isPending && (mutatingId?.startsWith("optimistic-") ?? false)
                }
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato aísla la lógica de las acciones del encabezado, cumpliendo la "Filosofía LEGO".
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción de `CampaignFilters`**: ((Vigente)) La lógica de filtros (actualmente ausente pero planificada) debería ser abstraída a su propio componente `CampaignFilters`, similar a `SiteFilters`.
 *
 * =====================================================================
 */
// src/components/campaigns/CampaignsHeaderActions.tsx
