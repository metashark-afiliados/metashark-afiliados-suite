// src/components/workspaces/CreateWorkspaceForm.tsx
/**
 * @file src/components/workspaces/CreateWorkspaceForm.tsx
 * @description Formulario de cliente de élite para la creación de workspaces.
 *              Ha sido refactorizado para eliminar el campo de selección de icono,
 *              simplificando la UI y alineándose con la nueva directiva de diseño.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { workspaces as workspaceActions } from "@/lib/actions";
import { logger } from "@/lib/logging";
import { CreateWorkspaceSchema } from "@/lib/validators";

type FormData = z.infer<typeof CreateWorkspaceSchema>;

export function CreateWorkspaceForm({ onSuccess }: { onSuccess: () => void }) {
  const t = useTranslations("WorkspaceSwitcher");
  const t_errors = useTranslations("ValidationErrors");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      workspaceName: "",
    },
  });

  const processSubmit = (data: FormData) => {
    logger.trace("[CreateWorkspaceForm] Enviando nuevo workspace.", {
      workspaceName: data.workspaceName,
    });
    startTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceName", data.workspaceName);

      const result = await workspaceActions.createWorkspaceAction(formData);

      if (result.success) {
        toast.success(t("create_form.success_toast"));
        logger.info("[CreateWorkspaceForm] Workspace creado con éxito.", {
          workspaceId: result.data.id,
        });
        onSuccess();
      } else {
        toast.error(t_errors(result.error as any));
        logger.error("[CreateWorkspaceForm] Fallo al crear workspace.", {
          error: result.error,
        });
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 relative">
      <div className="space-y-2">
        <Label htmlFor="workspaceName">{t("create_form.name_label")}</Label>
        <Input
          id="workspaceName"
          placeholder={t("create_form.name_placeholder")}
          aria-invalid={!!errors.workspaceName}
          {...register("workspaceName")}
        />
        {errors.workspaceName?.message && (
          <p className="text-sm text-destructive" role="alert">
            {t_errors(errors.workspaceName.message as any)}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading
          ? t("create_form.creating_button")
          : t("create_form.create_button")}
      </Button>
    </form>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simplificación de UI**: ((Implementada)) Se ha eliminado el campo de `EmojiPicker` y toda la lógica de `Controller` asociada. El formulario ahora es más simple y se enfoca únicamente en el nombre del workspace.
 * 2. **Sincronización de Contrato**: ((Implementada)) El formulario ya no intenta enviar el campo `icon`, alineándose con el `CreateWorkspaceSchema` actualizado.
 *
 * @subsection Melhorias Futuras
 * 1. **Selección de Plantilla de Workspace**: ((Vigente)) En lugar de un ícono, el formulario podría incluir un selector para que el usuario cree un workspace a partir de una plantilla (ej. "Para Agencia", "Proyecto Personal"), que podría pre-configurar sitios o campañas iniciales.
 *
 * =====================================================================
 */
// src/components/workspaces/CreateWorkspaceForm.tsx
