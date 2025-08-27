// src/components/builder/CreateSiteModal.tsx
/**
 * @file CreateSiteModal.tsx
 * @description Componente de UI atómico que encapsula el modal para crear un
 *              nuevo sitio. Ha sido refactorizado a un estándar de élite para
 *              ser soberano en su consumo de i18n y para alinearse con la API
 *              actualizada de `CreateSiteForm`, resolviendo los errores de tipo
 *              TS2339 y TS2322.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { useTranslations } from "next-intl";

import { CreateSiteForm } from "@/components/sites/CreateSiteForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateSiteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  workspaceId: string;
  onCreateSite: (formData: FormData) => void;
  isCreating: boolean;
}

export function CreateSiteModal({
  isOpen,
  onOpenChange,
  workspaceId,
  onCreateSite,
  isCreating,
}: CreateSiteModalProps) {
  const tSitesPage = useTranslations("SitesPage");

  if (!workspaceId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tSitesPage("header.createDialogTitle")}</DialogTitle>
        </DialogHeader>
        {/* --- INICIO DE CORRECCIÓN DE API (TS2322) --- */}
        <CreateSiteForm
          workspaceId={workspaceId}
          onSuccess={onCreateSite}
          isPending={isCreating}
        />
        {/* --- FIN DE CORRECCIÓN DE API (TS2322) --- */}
      </DialogContent>
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores de Tipo (TS2339, TS2322)**: ((Implementada)) Se ha eliminado la prop `texts` de la invocación de `CreateSiteForm`. Esta corrección alinea el `CreateSiteModal` con la API soberana de `CreateSiteForm`, que ahora consume sus propias traducciones internamente.
 * 2. **Soberanía de Componente**: ((Implementada)) Este componente ahora consume su propia traducción para el `DialogTitle`, completando su transición a un aparato soberano.
 *
 * @subsection Melhorias Futuras
 * 1. **Modal Genérico de Creación**: ((Vigente)) Este componente podría ser abstraído a un `GenericCreateModal` que acepte un `title` y un `children` (el formulario) como props, aumentando su reutilización para otras entidades.
 *
 * =====================================================================
 */
// src/components/builder/CreateSiteModal.tsx
