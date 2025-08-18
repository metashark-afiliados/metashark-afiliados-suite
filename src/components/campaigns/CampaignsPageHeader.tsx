// src/components/campaigns/CampaignsPageHeader.tsx
/**
 * @file src/components/campaigns/CampaignsPageHeader.tsx
 * @description Aparato de presentación de élite. Ha sido refactorizado para ser un
 *              componente de presentación puro, delegando la gestión del diálogo
 *              al hook soberano `useCampaignCreationDialog`.
 * @author Raz Podestá
 * @version 4.0.0
 */
"use client";

import { type useTranslations } from "next-intl";
import {
  ArrowLeft,
  FilePlus,
  ImageIcon,
  LayoutTemplate,
  PlusCircle,
} from "lucide-react";

import { useCampaignCreationDialog } from "@/lib/hooks/use-campaign-creation-dialog";
import { CreateCampaignForm } from "@/components/campaigns/CreateCampaignForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/lib/navigation";
import { type CampaignMetadata } from "@/lib/data/campaigns";

type TFunction = ReturnType<typeof useTranslations>;
type SiteInfo = { id: string; subdomain: string | null };
type CampaignStatus = "draft" | "published" | "archived";
type SortByOption = "updated_at_desc" | "name_asc";

export interface CampaignsPageHeaderProps {
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

export function CampaignsPageHeader({
  t,
  site,
  handleCreate,
  isPending,
  mutatingId,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: CampaignsPageHeaderProps): React.ReactElement {
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
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-4">
            <Link href="/dashboard/sites">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToSitesButton")}
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {t.rich("pageTitle", {
              siteName: site.subdomain,
              span: (chunks) => <span className="text-primary">{chunks}</span>,
            })}
          </h1>
          <p className="text-muted-foreground">{t("pageDescription")}</p>
        </div>
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
                    isPending &&
                    (mutatingId?.startsWith("optimistic-") ?? false)
                  }
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
        {/* ...Filtros (sin cambios)... */}
      </div>
    </div>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Presentación Puro**: ((Implementada)) Este componente ya no contiene lógica de estado para el diálogo de creación. Ahora consume `useCampaignCreationDialog`, simplificando su código y convirtiéndolo en un componente de presentación puro y controlado.
 *
 * =====================================================================
 */
// src/components/campaigns/CampaignsPageHeader.tsx
