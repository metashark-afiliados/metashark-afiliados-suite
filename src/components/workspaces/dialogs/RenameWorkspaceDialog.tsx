/**
 * @file RenameWorkspaceDialog.tsx
 * @description Aparato de UI atómico que encapsula el modal para renombrar
 *              un workspace. Ha sido refactorizado a un estándar de élite para
 *              consumir los namespaces de i18n canónicos, resolviendo errores
 *              críticos de `MISSING_MESSAGE` en el build de Vercel.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { type z } from "zod";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { UpdateWorkspaceNameSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof UpdateWorkspaceNameSchema>;

/**
 * @public
 * @component RenameWorkspaceDialog
 * @description Renderiza el diálogo modal para renombrar el workspace activo.
 * @returns {React.ReactElement | null} El componente de diálogo, o null si no hay workspace activo.
 */
export function RenameWorkspaceDialog(): React.ReactElement | null {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA (I18N Namespace) ---
  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  const tErrors = useTranslations("shared.ValidationErrors");
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---

  const { activeDialog, close } = useWorkspaceDialogStore();
  const { activeWorkspace } = useDashboard();
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(UpdateWorkspaceNameSchema),
    defaultValues: { name: activeWorkspace?.name || "" },
  });

  React.useEffect(() => {
    if (activeWorkspace) {
      reset({ name: activeWorkspace.name });
    }
  }, [activeWorkspace, reset]);

  if (!activeWorkspace) return null;

  const isOpen = activeDialog === "rename";

  const processSubmit: SubmitHandler<FormData> = (data) => {
    startTransition(async () => {
      const result = await workspaceActions.updateWorkspaceNameAction(
        activeWorkspace.id,
        data.name
      );
      if (result.success) {
        toast.success(t("edit_form.success_toast"));
        close();
      } else {
        toast.error(
          tErrors(result.error as any, { defaultValue: result.error })
        );
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("rename_dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("rename_dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rename-workspace-name">
              {t("create_form.name_label")}
            </Label>
            <Input
              id="rename-workspace-name"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {tErrors(errors.name.message as any)}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading
              ? t("rename_dialog.saving_button")
              : t("rename_dialog.save_button")}
          </Button>
        </form>
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
 * 1. **Resolución de Blocker de Build**: ((Implementada)) Se han corregido las llamadas a `useTranslations` con los namespaces canónicos, resolviendo las instancias de `MISSING_MESSAGE` para `WorkspaceSwitcher` y `ValidationErrors` que se originaban en este componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Hook Soberano `useRenameWorkspace`**: ((Vigente)) La lógica del formulario, la transición y el feedback de `toast` podrían ser abstraídos a su propio hook `useRenameWorkspaceForm` para una mayor cohesión y para convertir este componente en un presentador puro.
 *
 * =====================================================================
 */
