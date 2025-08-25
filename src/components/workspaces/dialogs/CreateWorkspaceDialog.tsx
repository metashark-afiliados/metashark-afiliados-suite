/**
 * @file CreateWorkspaceDialog.tsx
 * @description Componente de UI atómico que encapsula el modal para crear un
 *              nuevo workspace. Ha sido refactorizado a un estándar de élite
 *              para consumir el namespace de i18n canónico, resolviendo un
 *              error crítico de `MISSING_MESSAGE` en Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

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
 * @description Renderiza el diálogo modal para la creación de workspaces.
 *              Gestiona su propia visibilidad consumiendo el `useWorkspaceDialogStore`.
 * @returns {React.ReactElement} El componente de diálogo.
 */
export function CreateWorkspaceDialog(): React.ReactElement {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (I18N Namespace) ---
  // Se consume el namespace completo y canónico según la SSoT (i18n.ts),
  // resolviendo el error `MISSING_MESSAGE` que bloqueaba el build.
  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

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
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se ha corregido la llamada a `useTranslations` con el namespace canónico, resolviendo uno de los errores `MISSING_MESSAGE` que impedían el despliegue en Vercel.
 *
 * @subsection Melhorias Futuras
 * 1. **Contenido Dinámico del Header**: ((Vigente)) El título del diálogo podría ser más contextual, por ejemplo, mostrando un título diferente si el usuario es redirigido desde un flujo de onboarding. Esto se puede lograr pasando props a través del `useWorkspaceDialogStore`.
 *
 * =====================================================================
 */
