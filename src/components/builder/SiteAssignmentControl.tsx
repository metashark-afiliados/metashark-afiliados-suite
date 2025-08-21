// src/components/builder/SiteAssignmentControl.tsx
/**
 * @file SiteAssignmentControl.tsx
 * @description Orquestador de UI puro. Consume el hook `useSiteAssignment` y
 *              ensambla los componentes atómicos `SiteSelector` y `CreateSiteModal`
 *              para construir el flujo completo de asignación de sitios.
 * @author Raz Podestá
 * @version 3.0.0
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

  const formTexts = {
    nameLabel: texts.tSitesPage("form.nameLabel"),
    namePlaceholder: texts.tSitesPage("form.namePlaceholder"),
    subdomainLabel: texts.tSitesPage("form.subdomainLabel"),
    subdomainInUseError: texts.tSitesPage("form.subdomainInUseError"),
    descriptionLabel: texts.tSitesPage("form.descriptionLabel"),
    descriptionPlaceholder: texts.tSitesPage("form.descriptionPlaceholder"),
    creatingButton: texts.tSitesPage("form.creatingButton"),
    createButton: texts.tSitesPage("form.createButton"),
  };

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
      <CreateSiteModal
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        workspaceId={activeWorkspace?.id || ""}
        onCreateSite={handleCreateSite}
        isCreating={isCreating}
        texts={{
          dialogTitle: texts.tSitesPage("header.createDialogTitle"),
          formTexts,
        }}
      />
    </>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arquitectura de Ensamblaje (LEGO)**: ((Implementada)) El componente ahora es un orquestador puro que sigue el patrón "Hook, Ensamblador, Componentes Atómicos", una implementación canónica de la "Filosofía LEGO".
 * 2. **Legibilidad y Mantenibilidad Mejoradas**: ((Implementada)) La complejidad ha sido distribuida en aparatos de responsabilidad única, haciendo el código más fácil de entender, probar y mantener.
 *
 * =====================================================================
 */
// src/components/builder/SiteAssignmentControl.tsx
