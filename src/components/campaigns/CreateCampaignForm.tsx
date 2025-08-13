/**
 * @file src/components/campaigns/CreateCampaignForm.tsx
 * @description Formulario de cliente soberano para la creación de nuevas campañas.
 *              Ha sido nivelado a un estándar de élite, utilizando `react-hook-form`
 *              y `zodResolver` para una validación robusta y en tiempo real del
 *              lado del cliente.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateCampaignSchema } from "@/lib/validators";

type FormInputData = z.infer<typeof CreateCampaignSchema>;

interface CreateCampaignFormProps {
  siteId: string;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}

export function CreateCampaignForm({
  siteId,
  onSubmit,
  isPending,
}: CreateCampaignFormProps) {
  const t = useTranslations("CampaignsPage");

  const form = useForm<FormInputData>({
    resolver: zodResolver(CreateCampaignSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      slug: "",
      siteId,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const processSubmit: SubmitHandler<FormInputData> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.slug) {
      formData.append("slug", data.slug);
    }
    formData.append("siteId", data.siteId);
    onSubmit(formData);
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 relative">
      <input type="hidden" {...register("siteId")} />
      <div className="space-y-2">
        <Label htmlFor="name">{t("form_name_label")}</Label>
        <Input
          id="name"
          placeholder={t("form_name_placeholder")}
          {...register("name")}
          aria-invalid={!!errors.name}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {t(errors.name.message as any)}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? t("form_creating_button") : t("form_create_button")}
      </Button>
    </form>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Validación de Cliente Robusta**: ((Implementada)) La migración a `react-hook-form` proporciona validación instantánea, mejorando la UX.
 * @subsection Melhorias Futuras
 * 1. **Campo de Slug Opcional**: ((Vigente)) Añadir un campo de texto para el `slug`.
 * =====================================================================
 */
