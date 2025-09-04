// src/components/builder/SiteAssignmentControl.tsx
/**
 * @file SiteAssignmentControl.tsx
 * @description Orquestador de UI puro. Simplificado para ya no hacer
 *              "prop drilling" de funciones de traducción a sus hijos.
 * @author L.I.A. Legacy
 * @version 5.0.0
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
    t,
  } = useSiteAssignment(campaignId);

  if (isLoadingSites) {
    return (
      <div className="text-sm text-muted-foreground p-4 border-t flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("loading_context")}
      </div>
    );
  }

  return (
    <>
      <div className="p-4 border-t space-y-3">
        <h4 className="font-semibold">{t("section_title")}</h4>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
        <SiteSelector
          sites={sites}
          selectedSiteId={selectedSiteId}
          onSiteSelect={setSelectedSiteId}
          onAssign={handleAssignSite}
          onCreateNew={openCreateDialog}
          isPending={isPending}
          isAssigning={isAssigning}
        />
      </div>
      <CreateSiteModal
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        workspaceId={activeWorkspace?.id || ""}
        onCreateSite={handleCreateSite}
        isCreating={isCreating}
      />
    </>
  );
}
// src/components/builder/SiteAssignmentControl.tsx
