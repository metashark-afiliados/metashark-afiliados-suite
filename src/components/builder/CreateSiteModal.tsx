// src/components/builder/CreateSiteModal.tsx
/**
 * @file CreateSiteModal.tsx
 * @description Componente de UI atómico que encapsula el modal para crear un
 *              nuevo sitio dentro del flujo del constructor.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

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
  texts: {
    dialogTitle: string;
    formTexts: React.ComponentProps<typeof CreateSiteForm>["texts"];
  };
}

export function CreateSiteModal({
  isOpen,
  onOpenChange,
  workspaceId,
  onCreateSite,
  isCreating,
  texts,
}: CreateSiteModalProps) {
  if (!workspaceId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{texts.dialogTitle}</DialogTitle>
        </DialogHeader>
        <CreateSiteForm
          workspaceId={workspaceId}
          onSuccess={onCreateSite}
          isPending={isCreating}
          texts={texts.formTexts}
        />
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
 * 1. **Encapsulamiento de Modal**: ((Implementada)) Este componente aísla la lógica y el JSX del modal, simplificando el orquestador principal.
 *
 * =====================================================================
 */
// src/components/builder/CreateSiteModal.tsx
