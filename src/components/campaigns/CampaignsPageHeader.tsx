/**
 * @file src/components/campaigns/CampaignsPageHeader.tsx
 * @description Aparato de presentación de élite para el encabezado de la página de campañas.
 *              Ha sido nivelado para incluir el "Hub de Creación" y controles
 *              interactivos de filtro y ordenamiento, transformándolo en un
 *              centro de comando para la gestión de datos.
 * @author Raz Podestá
 * @version 3.0.0
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

import { CreateCampaignForm } from "@/components/campaigns/CreateCampaignForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

type TFunction = ReturnType<typeof useTranslations>;
type SiteInfo = { id: string; subdomain: string | null };
type CampaignStatus = "draft" | "published" | "archived";
type SortByOption = "updated_at_desc" | "name_asc";

/**
 * @public
 * @interface CampaignsPageHeaderProps
 * @description Define el contrato de props de élite para el `CampaignsPageHeader`.
 *              Recibe todo su contenido, estado y manejadores de lógica,
 *              adhiriéndose a los principios de componente puro y controlado.
 */
export interface CampaignsPageHeaderProps {
  t: TFunction;
  site: SiteInfo;
  isCreateDialogOpen: boolean;
  setCreateDialogOpen: (isOpen: boolean) => void;
  handleCreate: (formData: FormData) => void;
  isPending: boolean;
  mutatingId: string | null;
  statusFilter?: CampaignStatus;
  onStatusChange: (status: CampaignStatus | "all") => void;
  sortBy: SortByOption;
  onSortChange: (sort: SortByOption) => void;
}

/**
 * @public
 * @component CampaignsPageHeader
 * @description Renderiza el encabezado completo de la página de gestión de campañas.
 * @param {CampaignsPageHeaderProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} El componente de encabezado renderizado.
 */
export function CampaignsPageHeader({
  t,
  site,
  isCreateDialogOpen,
  setCreateDialogOpen,
  handleCreate,
  isPending,
  mutatingId,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: CampaignsPageHeaderProps): React.ReactElement {
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
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("createCampaignButton")}
            </Button>
          </DialogTrigger>
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
                  onSubmit={handleCreate}
                  isPending={
                    isPending &&
                    (mutatingId?.startsWith("optimistic-") ?? false)
                  }
                />
              </TabsContent>
              <TabsContent value="from_template">
                <div className="flex h-48 items-center justify-center rounded-md border border-dashed text-center">
                  <p className="text-sm text-muted-foreground">
                    {t("createDialog.template_gallery_placeholder")}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="from_image_ai">
                <div className="flex h-48 items-center justify-center rounded-md border border-dashed text-center">
                  <p className="text-sm text-muted-foreground">
                    {t("createDialog.ai_importer_placeholder")}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-auto sm:max-w-xs">
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              onStatusChange(value as CampaignStatus | "all")
            }
          >
            <SelectTrigger aria-label={t("filters.status_label")}>
              <SelectValue placeholder={t("filters.status_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.status_all")}</SelectItem>
              <SelectItem value="draft">{t("status.draft")}</SelectItem>
              <SelectItem value="published">{t("status.published")}</SelectItem>
              <SelectItem value="archived">{t("status.archived")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto sm:max-w-xs">
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as SortByOption)}
          >
            <SelectTrigger aria-label={t("filters.sort_label")}>
              <SelectValue placeholder={t("filters.sort_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at_desc">
                {t("filters.sort_updated_desc")}
              </SelectItem>
              <SelectItem value="name_asc">
                {t("filters.sort_name_asc")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
 * 1. **Centro de Comando Interactivo**: ((Implementada)) Se han añadido los controles de `<Select>` para el filtrado por estado y el ordenamiento de las campañas, transformando el encabezado en una herramienta de control de datos.
 * 2. **Hub de Creación**: ((Implementada)) Se ha mantenido el "Hub de Creación" con pestañas, una mejora de UX de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Implementación de Galería de Plantillas**: ((Vigente)) La pestaña "Desde Plantilla" sigue siendo el siguiente paso lógico para enriquecer la funcionalidad de creación de campañas.
 *
 * =====================================================================
 */
