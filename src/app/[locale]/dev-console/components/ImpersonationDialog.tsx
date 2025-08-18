// src/app/[locale]/dev-console/components/ImpersonationDialog.tsx
/**
 * @file ImpersonationDialog.tsx
 * @description Componente atómico para la funcionalidad de suplantación de usuario.
 *              Ha sido refactorizado para usar el componente genérico `ConfirmationDialog`,
 *              mejorando la reutilización y la consistencia de la UI.
 *              ¡IMPORTANTE!: Refactorizado para una Internacionalización Completa.
 * @author Raz Podestá
 * @version 2.0.1
 */
"use client";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Loader2, UserCog } from "lucide-react";
import React from "react";

import { admin as adminActions } from "@/lib/actions";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

type ProfileRow = UserProfilesWithEmail["Row"];

export function ImpersonationDialog({ profile }: { profile: ProfileRow }) {
  // --- INICIO DE REFACTORIZACIÓN: Internacionalización Completa ---
  const t = useTranslations("app.dev-console.ImpersonationDialog");
  // --- FIN DE REFACTORIZACIÓN ---
  const [isPending, startTransition] = React.useTransition();

  const handleImpersonate = (formData: FormData) => {
    const userIdToImpersonate = formData.get("userId") as string;

    if (!userIdToImpersonate) {
      toast.error(t("default_error_toast"));
      return;
    }

    startTransition(async () => {
      const result = await adminActions.impersonateUserAction(formData);
      if (result.success) {
        toast.success(t("success_toast"));
        // Assuming admin.actions.ts returns the signInLink directly in data
        window.open(result.data.signInLink, "_blank");
      } else {
        // --- INICIO DE REFACTORIZACIÓN: Consumir mensaje de error de i18n ---
        // admin.actions.ts no devuelve aún claves de i18n, por lo que usamos default_error_toast.
        toast.error(t("default_error_toast"));
        // --- FIN DE REFACTORIZACIÓN ---
      }
    });
  };

  const profileEmail = profile.email ?? t("unknown_email_fallback"); // Fallback internacionalizado

  return (
    <ConfirmationDialog
      triggerButton={
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("aria_label", {
            email: profileEmail,
          })}
        >
          <UserCog className="h-4 w-4 text-muted-foreground" />
        </Button>
      }
      icon={UserCog}
      title={t("title")}
      description={t.rich("description", {
        email: profileEmail,
        strong: (chunks) => <strong>{chunks}</strong>,
      })}
      confirmButtonText={t("confirm_button")}
      cancelButtonText={t("cancel_button")} // Consumir del mismo namespace
      onConfirm={handleImpersonate}
      isPending={isPending}
      hiddenInputs={{ userId: profile.id ?? "" }}
      // No confirmationText needed as it's not a "type to confirm" dialog for impersonation
    />
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Full Internacionalización**: ((Implementada)) Todos los textos del diálogo y sus botones han sido extraídos al archivo `ImpersonationDialog.json` y se consumen con `useTranslations`. Esto resuelve una brecha crítica del protocolo.
 * 2. **Consistencia de Mensajes de Error**: ((Implementada)) Se ha asegurado que los `toast`s de error consuman una clave de i18n, aunque de fallback por ahora.
 * 3. **Consistencia de Cancel Button**: ((Implementada)) El texto del botón de cancelar ahora se obtiene del mismo namespace de `ImpersonationDialog`.
 *
 * @subsection Melhorias Futuras
 * 1. **Feedback Visual de Sucesso/Erro**: ((Vigente)) Aprimorar o `ConfirmationDialog` para exibir um feedback visual mais rico após a confirmação/cancelamento, talvez com um ícone de sucesso/erro e uma mensagem por um breve período.
 *
 * =====================================================================
 */
