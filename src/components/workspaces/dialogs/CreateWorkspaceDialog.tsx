// src/components/workspaces/dialogs/CreateWorkspaceDialog.tsx
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { CreateWorkspaceForm } from "../CreateWorkspaceForm";

/**
 * @public
 * @component CreateWorkspaceDialog
 * @description Componente de UI atómico que encapsula el modal para crear un
 *              nuevo workspace. Consume `useWorkspaceDialogStore` para gestionar
 *              su propia visibilidad de forma desacoplada.
 * @returns {React.ReactElement} El componente de diálogo.
 */
export function CreateWorkspaceDialog() {
  const t = useTranslations("WorkspaceSwitcher");
  const { activeDialog, close } = useWorkspaceDialogStore();

  const isOpen = activeDialog === "create";

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("onboarding_title")}</DialogTitle>
        </DialogHeader>
        <CreateWorkspaceForm onSuccess={close} />
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
 * 1. **Componente Atómico y Autocontenido**: ((Implementada)) Este componente ahora gestiona su propia visibilidad suscribiéndose al store, adhiriéndose a la "Filosofía LEGO".
 * 2. **Composición Pura**: ((Implementada)) Actúa como un ensamblador puro que compone el `CreateWorkspaceForm`.
 *
 * @subsection Melhorias Futuras
 * 1. **Transiciones de Contenido**: ((Vigente)) Si el formulario de creación se hiciera multi-paso, se podría usar `framer-motion` para animar la transición entre pasos dentro del `DialogContent`.
 *
 * =====================================================================
 */
// src/components/workspaces/dialogs/CreateWorkspaceDialog.tsx
