// src/components/builder/SiteAssignmentControl.tsx
/**
 * @file SiteAssignmentControl.tsx
 * @description Orquestador de UI puro. Consume el hook `useSiteAssignment` y
 *              ensambla los componentes atómicos `SiteSelector` y `CreateSiteModal`.
 *              Ha sido refactorizado para alinearse con la API soberana de
 *              `CreateSiteModal`, resolviendo el error de tipo TS2322.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { Loader2 } from "lucide-react";

import { useSiteAssignment } from "@/lib/hooks/use-site-assignment";
import { CreateSiteModal } from "./CreateSiteModal";
import { SiteSelector } from "./SiteSelector";

interface SiteAssignmentControlProps {
  campaignId: string;
}

export function SiteAssignmentControl({
  campaignId,
}: SiteAssignmentControlProps) {
  const {
    sites,
    selectedSiteId,
    setSelectedSiteId,
    isLoadingSites,
    isAssigning,
    isCreating,
    isPending,
    handleAssignSite,
    isCreateDialogOpen,
    openCreateDialog,
    setCreateDialogOpen,
    handleCreateSite,
    activeWorkspace,
    texts,
  } = useSiteAssignment(campaignId);

  if (isLoadingSites) {
    return (
      <div className="text-sm text-muted-foreground p-4 border-t flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {texts.t("loading_context")}
      </div>
    );
  }

  return (
    <>
      <div className="p-4 border-t space-y-3">
        <h4 className="font-semibold">{texts.t("section_title")}</h4>
        <p className="text-sm text-muted-foreground">
          {texts.t("description")}
        </p>
        <SiteSelector
          sites={sites}
          selectedSiteId={selectedSiteId}
          onSiteSelect={setSelectedSiteId}
          onAssign={handleAssignSite}
          onCreateNew={openCreateDialog}
          isPending={isPending}
          isAssigning={isAssigning}
          texts={{
            select_placeholder: texts.t("select_placeholder"),
            assign_button: texts.t("assign_button"),
            createSiteButton: texts.tSitesPage("header.createSiteButton"),
          }}
        />
      </div>
      {/* --- INICIO DE CORRECCIÓN DE API (TS2322) --- */}
      <CreateSiteModal
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        workspaceId={activeWorkspace?.id || ""}
        onCreateSite={handleCreateSite}
        isCreating={isCreating}
      />
      {/* --- FIN DE CORRECCIÓN DE API (TS2322) --- */}
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Compilación (TS2322)**: ((Implementada)) Se ha eliminado la prop `texts` de la invocación de `CreateSiteModal`. Esta corrección alinea este componente con la API soberana de `CreateSiteModal`, que ahora consume sus propias traducciones internamente.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente de Esqueleto de Carga**: ((Vigente)) El estado de carga (`isLoadingSites`) podría renderizar un componente de esqueleto (`Skeleton`) más sofisticado en lugar de un simple texto con spinner.
 *
 * =====================================================================
 */
// src/components/builder/SiteAssignmentControl.tsx
