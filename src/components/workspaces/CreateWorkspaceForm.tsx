// src/components/workspaces/CreateWorkspaceForm.tsx
/**
 * @file src/components/workspaces/CreateWorkspaceForm.tsx
 * @description Formulario de cliente soberano que ensambla campos atómicos
 *              para la creación de workspaces. Ahora consume sus propias
 *              traducciones, resolviendo un error de tipo TS2339.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.1.0
 */
"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateWorkspaceForm } from "@/lib/hooks/useCreateWorkspaceForm";
import { clientLogger } from "@/lib/logging";
import { WorkspaceNameInputField } from "./form-fields/WorkspaceNameInputField";

interface CreateWorkspaceFormProps {
  onSuccess: () => void;
}

/**
 * @public
 * @component CreateWorkspaceForm
 * @description Renderiza un formulario para la creación de workspaces.
 * @param {CreateWorkspaceFormProps} props - Las propiedades para configurar el formulario.
 * @returns {React.ReactElement}
 */
export function CreateWorkspaceForm({
  onSuccess,
}: CreateWorkspaceFormProps): React.ReactElement {
  clientLogger.trace(
    "[CreateWorkspaceForm] Renderizando ensamblador de formulario soberano."
  );

  const t = useTranslations("components.workspaces.WorkspaceSwitcher");
  const { form, isLoading, processSubmit } = useCreateWorkspaceForm({
    onSuccess,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 relative">
      <WorkspaceNameInputField
        register={register}
        errors={errors}
        isPending={isLoading}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading
          ? t("create_form.creating_button")
          : t("create_form.create_button")}
      </Button>
    </form>
  );
}
// src/components/workspaces/CreateWorkspaceForm.tsx
