// src/components/workspaces/dialogs/DeleteWorkspaceDialog.tsx
/**
 * @file DeleteWorkspaceDialog.tsx
 * @description Componente de UI que implementa un "Formulario Soberano" para la
 *              eliminación de un workspace. Sincronizado con la API v9.0 del
 *              ecosistema `Button` y con rutas de importación corregidas.
 * @author Raz Podestá
 * @version 3.2.0
 */
"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { ShieldAlert } from "lucide-react";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
// --- INICIO DE CORRECCIÓN DE RUTAS ---
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";
import { ConfirmationInput } from "@/components/ui/ConfirmationInput";
// --- FIN DE CORRECCIÓN DE RUTAS ---

export function DeleteWorkspaceDialog(): React.ReactElement | null {
  const t = useTranslations("WorkspaceSwitcher");
  const tDialogs = useTranslations("Dialogs");
  const tErrors = useTranslations("ValidationErrors");
  const { activeDialog, close } = useWorkspaceDialogStore();
  const { activeWorkspace } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!activeWorkspace) return null;

  const handleDelete = (formData: FormData) => {
    startTransition(async () => {
      const result = await workspaceActions.deleteWorkspaceAction(formData);
      if (result.success) {
        toast.success(t("delete_dialog.success_toast"));
        close();
      } else {
        toast.error(
          tErrors(result.error as any, { defaultValue: result.error })
        );
      }
    });
  };

  const isConfirmationRequired = !!activeWorkspace.name;
  const isConfirmButtonDisabled =
    isPending || (isConfirmationRequired && !isConfirmed);

  return (
    <Dialog open={activeDialog === "delete"} onOpenChange={close}>
      <form action={handleDelete}>
        <ConfirmationDialogContent
          icon={ShieldAlert}
          title={t("delete_dialog.title")}
          description={t.rich("delete_dialog.description", {
            workspaceName: activeWorkspace.name,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
          onClose={close}
          body={
            <ConfirmationInput
              label={t.rich("delete_dialog.confirmation_label", {
                workspaceName: activeWorkspace.name,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
              confirmationText={activeWorkspace.name}
              onConfirmationChange={setIsConfirmed}
              isPending={isPending}
            />
          }
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={close}
              >
                {tDialogs("generic_cancelButton")}
              </Button>
              <input
                type="hidden"
                name="workspaceId"
                value={activeWorkspace.id}
              />
              <Button
                variant="solid"
                colorScheme="destructive"
                type="submit"
                disabled={isConfirmButtonDisabled}
                isLoading={isPending}
              >
                {t("delete_dialog.confirm_button")}
              </Button>
            </>
          }
        />
      </form>
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Errores de Módulo (TS2305)**: ((Implementada)) Se han corregido las rutas de importación para `ConfirmationDialogContent` y `ConfirmationInput`, resolviendo los errores de compilación y respetando la arquitectura de archivos atómica del proyecto.
 *
 * =====================================================================
 */
// src/components/workspaces/dialogs/DeleteWorkspaceDialog.tsx
