// src/components/workspaces/dialogs/RenameWorkspaceDialog.tsx
/**
 * @file RenameWorkspaceDialog.tsx
 * @description Aparato de UI atómico que encapsula el modal para renombrar
 *              un workspace. Consume el store de diálogos para su visibilidad.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { type z } from "zod";
import { Loader2 } from "lucide-react";

import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useWorkspaceDialogStore } from "@/lib/hooks/useWorkspaceDialogStore";
import { UpdateWorkspaceNameSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof UpdateWorkspaceNameSchema>;

export function RenameWorkspaceDialog() {
  const t = useTranslations("WorkspaceSwitcher");
  const tErrors = useTranslations("ValidationErrors");
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
 * 1. **Componente de Edición Atómico**: ((Implementada)) Este nuevo aparato desacopla la lógica de renombrar del `WorkspaceTrigger`, completando la refactorización.
 *
 * =====================================================================
 */
// src/components/workspaces/dialogs/RenameWorkspaceDialog.tsx
