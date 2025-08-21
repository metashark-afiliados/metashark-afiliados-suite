// src/components/workspaces/CreateWorkspaceForm.tsx
/**
 * @file src/components/workspaces/CreateWorkspaceForm.tsx
 * @description Formulario de cliente soberano para la creación de workspaces.
 *              Gestiona su propio estado con `react-hook-form` y `zodResolver`
 *              para una validación robusta y en tiempo real.
 * @author Raz Podestá
 * @version 2.1.0
 */
"use client";

import { useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { workspaces as workspaceActions } from "@/lib/actions";
import { clientLogger } from "@/lib/logging";
import { CreateWorkspaceSchema } from "@/lib/validators";

type FormData = z.infer<typeof CreateWorkspaceSchema>;

/**
 * @public
 * @interface CreateWorkspaceFormProps
 * @description Contrato de props para el formulario. Define el callback de éxito.
 */
interface CreateWorkspaceFormProps {
  onSuccess: () => void;
}

/**
 * @public
 * @component CreateWorkspaceForm
 * @description Renderiza un formulario robusto para la creación de workspaces.
 * @param {CreateWorkspaceFormProps} props - Las propiedades para configurar el formulario.
 * @returns {React.ReactElement}
 */
export function CreateWorkspaceForm({
  onSuccess,
}: CreateWorkspaceFormProps): React.ReactElement {
  const t = useTranslations("WorkspaceSwitcher");
  const tErrors = useTranslations("ValidationErrors");
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

  const processSubmit: SubmitHandler<FormData> = (data) => {
    clientLogger.trace("[CreateWorkspaceForm] Enviando nuevo workspace.", {
      workspaceName: data.workspaceName,
    });

    startTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceName", data.workspaceName);

      const result = await workspaceActions.createWorkspaceAction(formData);

      if (result.success) {
        toast.success(t("create_form.success_toast"));
        clientLogger.info("[CreateWorkspaceForm] Workspace creado con éxito.", {
          workspaceId: result.data.id,
        });
        onSuccess();
      } else {
        toast.error(
          tErrors(result.error as any, { defaultValue: result.error })
        );
        clientLogger.error("[CreateWorkspaceForm] Fallo al crear workspace.", {
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
          disabled={isLoading}
          {...register("workspaceName")}
          name="workspaceName"
        />
        {errors.workspaceName?.message && (
          <p className="text-sm text-destructive" role="alert">
            {tErrors(errors.workspaceName.message as any)}
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
 * 1. **Compatibilidad con Server Actions**: ((Implementada)) Se ha añadido el atributo `name` explícito al input, garantizando que el `FormData` se construya correctamente y que la Server Action sea invocada.
 *
 * @subsection Melhorias Futuras
 * 1. **Selección de Plantilla**: ((Vigente)) El formulario podría incluir un selector para crear un workspace a partir de una plantilla, como "Agencia" o "Marketer Solitario", que preconfigure sitios o campañas iniciales.
 *
 * =====================================================================
 */
// src/components/workspaces/CreateWorkspaceForm.tsx
