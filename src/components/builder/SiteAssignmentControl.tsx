// src/components/builder/SiteAssignmentControl.tsx
/**
 * @file SiteAssignmentControl.tsx
 * @description Aparato de UI atómico y especializado. Su única responsabilidad
 *              es renderizar los controles para asignar una campaña huérfana
 *              a un sitio existente. Es un componente de cliente que gestiona
 *              su propio estado de datos y mutación.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React, { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { assignSiteToCampaignAction } from "@/lib/actions/campaigns/assign-site.action";
import { useDashboard } from "@/lib/context/DashboardContext";
import { type SiteBasicInfo, getSitesByWorkspaceId } from "@/lib/data/sites";
import { logger } from "@/lib/logging";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ActionResult } from "@/lib/validators";

interface SiteAssignmentControlProps {
  campaignId: string;
}

export function SiteAssignmentControl({
  campaignId,
}: SiteAssignmentControlProps) {
  const t = useTranslations("SiteAssignmentControl");
  const tErrors = useTranslations("CampaignsPage.errors");
  const { activeWorkspace } = useDashboard();
  const [sites, setSites] = useState<SiteBasicInfo[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isLoadingSites, setIsLoadingSites] = useState(true);

  useEffect(() => {
    if (activeWorkspace) {
      getSitesByWorkspaceId(activeWorkspace.id, { limit: 1000 })
        .then(({ sites: fetchedSites }) => {
          setSites(fetchedSites);
        })
        .catch((err) => {
          logger.error(
            "[SiteAssignmentControl] Fallo al obtener la lista de sitios",
            err
          );
          toast.error(t("toast_load_sites_error"));
        })
        .finally(() => {
          setIsLoadingSites(false);
        });
    }
  }, [activeWorkspace, t]);

  const handleAssignSite = () => {
    if (!selectedSiteId) {
      toast.error(t("toast_select_site_error"));
      return;
    }
    startTransition(async () => {
      const result: ActionResult<void> = await assignSiteToCampaignAction(
        campaignId,
        selectedSiteId
      );
      if (result.success) {
        toast.success(t("toast_assign_success"));
        // No se necesita `router.refresh()` aquí porque el `revalidatePath` en la
        // server action se encargará de refrescar los datos del layout y la página.
      } else {
        toast.error(tErrors(result.error as any));
      }
    });
  };

  if (!activeWorkspace || isLoadingSites) {
    return (
      <div className="text-sm text-muted-foreground p-4 border-t flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("loading_context")}
      </div>
    );
  }

  return (
    <div className="p-4 border-t space-y-3">
      <h4 className="font-semibold">{t("section_title")}</h4>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      <div className="flex items-center gap-2">
        <Select onValueChange={setSelectedSiteId} value={selectedSiteId}>
          <SelectTrigger>
            <SelectValue placeholder={t("select_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {sites.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name} ({site.subdomain})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAssignSite}
          disabled={isPending || !selectedSiteId}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("assign_button")}
        </Button>
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
 * 1. **Componente de Asignación Funcional**: ((Implementada)) Este nuevo aparato encapsula toda la UI y lógica del lado del cliente para la asignación de sitios.
 * 2. **Obtención de Datos Segura**: ((Implementada)) El componente utiliza una función de la capa de datos (`getSitesByWorkspaceId`) para obtener de forma segura solo los sitios a los que el usuario tiene acceso.
 * 3. **Full Internacionalización**: ((Implementada)) Todos los textos se consumen desde la capa de i18n, incluyendo los mensajes de error de la Server Action.
 *
 * @subsection Melhorias Futuras
 * 1. **Creación de Sitio "In-line"**: ((Vigente)) Añadir un botón o una opción en el `<Select>` para "Crear Nuevo Sitio", que abriría un modal para crear un sitio sin abandonar el builder, mejorando drásticamente el flujo de usuario.
 *
 * =====================================================================
 */
// src/components/builder/SiteAssignmentControl.tsx
