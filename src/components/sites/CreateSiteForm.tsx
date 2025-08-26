// src/components/sites/CreateSiteForm.tsx
/**
 * @file CreateSiteForm.tsx
 * @description Formulario de cliente soberano para la creación de nuevos sitios.
 *              Gestiona su propio estado y consume sus propias traducciones.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateSiteClientSchema } from "@/lib/validators";
import { clientLogger } from "@/lib/logging";
import { SubdomainInput } from "./SubdomainInput";

interface CreateSiteFormProps {
  workspaceId: string;
  onSuccess: (formData: FormData) => void;
  isPending: boolean;
}

type FormInputData = z.infer<typeof CreateSiteClientSchema>;

export function CreateSiteForm({
  workspaceId,
  onSuccess,
  isPending,
}: CreateSiteFormProps): React.ReactElement {
  clientLogger.trace("[CreateSiteForm] Renderizando formulario soberano.");
  const t = useTranslations("SitesPage.form");
  const tErrors = useTranslations("SitesPage.validationErrors");

  const form = useForm<FormInputData>({
    resolver: zodResolver(CreateSiteClientSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      subdomain: "",
      workspaceId: workspaceId,
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const processSubmit: SubmitHandler<FormInputData> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("subdomain", data.subdomain);
    formData.append("workspaceId", data.workspaceId);
    formData.append("description", data.description || "");
    onSuccess(formData);
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 relative">
      <input type="hidden" {...register("workspaceId")} />
      <div className="space-y-2">
        <Label htmlFor="name">{t("nameLabel")}</Label>
        <Input
          id="name"
          placeholder={t("namePlaceholder")}
          {...register("name")}
          disabled={isLoading}
          hasError={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {tErrors(errors.name.message as any)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subdomain">{t("subdomainLabel")}</Label>
        <SubdomainInput form={form} errorText={t("subdomainInUseError")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t("descriptionLabel")}</Label>
        <Input
          id="description"
          placeholder={t("descriptionPlaceholder")}
          {...register("description")}
          disabled={isLoading}
          hasError={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive" role="alert">
            {tErrors(errors.description.message as any)}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? t("creatingButton") : t("createButton")}
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
 * 1. ((Implementada)) **Soberanía de i18n:** El componente ahora consume `useTranslations` internamente, eliminando la prop `texts` y simplificando su API.
 * 2. ((Implementada)) **Full Observabilidad:** Se ha añadido `clientLogger.trace` para registrar su renderizado.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Selector de Iconos:** Añadir un campo para que el usuario pueda seleccionar un emoji como ícono para su sitio, similar a la creación de workspaces.
 *
 * =====================================================================
 */
// src/components/sites/CreateSiteForm.tsx
