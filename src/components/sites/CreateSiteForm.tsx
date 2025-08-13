// src/components/sites/CreateSiteForm.tsx
/**
 * @file src/components/sites/CreateSiteForm.tsx
 * @description Formulario de cliente para la creación de nuevos sitios. Es un
 *              componente de presentación inteligente: gestiona su propio estado
 *              con `react-hook-form` pero delega la mutación a una Server Action
 *              pasada por props. Es completamente internacionalizado y observable.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateSiteClientSchema } from "@/lib/validators";

import { SubdomainInput } from "./SubdomainInput";

/**
 * @public
 * @interface CreateSiteFormTexts
 * @description Define el contrato de props para todos los textos internacionalizados
 *              que el formulario necesita, asegurando su desacoplamiento de i18n.
 */
export interface CreateSiteFormTexts {
  nameLabel: string;
  namePlaceholder: string;
  subdomainLabel: string;
  subdomainInUseError: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  creatingButton: string;
  createButton: string;
}

interface CreateSiteFormProps {
  workspaceId: string;
  onSuccess: (formData: FormData) => void;
  isPending: boolean;
  texts: CreateSiteFormTexts;
}

type FormInputData = z.infer<typeof CreateSiteClientSchema>;

/**
 * @public
 * @component CreateSiteForm
 * @description Renderiza un formulario robusto para la creación de sitios.
 * @param {CreateSiteFormProps} props - Las propiedades para configurar el formulario.
 * @returns {React.ReactElement}
 */
export function CreateSiteForm({
  workspaceId,
  onSuccess,
  isPending,
  texts,
}: CreateSiteFormProps): React.ReactElement {
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
        <Label htmlFor="name">{texts.nameLabel}</Label>
        <Input
          id="name"
          placeholder={texts.namePlaceholder}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subdomain">{texts.subdomainLabel}</Label>
        <SubdomainInput form={form} errorText={texts.subdomainInUseError} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{texts.descriptionLabel}</Label>
        <Input
          id="description"
          placeholder={texts.descriptionPlaceholder}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? texts.creatingButton : texts.createButton}
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
 * 1. **Composición Atómica**: ((Implementada)) Este formulario compone el aparato `SubdomainInput` reconstruido, demostrando la "Filosofía LEGO".
 * 2. **Patrón de Formulario Soberano**: ((Implementada)) Utiliza `react-hook-form` y `zodResolver` para una validación robusta y una UX superior del lado del cliente.
 * 3. **Componente Puro y Controlado**: ((Implementada)) Es un componente puro que recibe su lógica de mutación (`onSuccess`) y todo su contenido textual (`texts`) a través de props.
 *
 * @subsection Melhorias Futuras
 * 1. **Selector de Iconos**: ((Vigente)) Añadir un campo para que el usuario pueda seleccionar un emoji como ícono para su sitio, similar al `CreateWorkspaceForm`.
 * 2. **Feedback de Validación en Tiempo Real**: ((Vigente)) Aunque `onTouched` está configurado, la UI podría mejorarse para mostrar marcas de verificación verdes junto a los campos que pasan la validación, proporcionando un feedback más proactivo.
 *
 * =====================================================================
 */
// src/components/sites/CreateSiteForm.tsx
