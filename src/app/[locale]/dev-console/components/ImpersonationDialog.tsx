// src/app/[locale]/dev-console/components/ImpersonationDialog.tsx
/**
 * @file ImpersonationDialog.tsx
 * @description Componente atómico para la funcionalidad de suplantación de usuario.
 *              Ha sido refactorizado para usar el componente genérico `ConfirmationDialog`,
 *              mejorando la reutilización y la consistencia de la UI.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Loader2, UserCog } from "lucide-react";
import React from "react";

import { admin as adminActions } from "@/lib/actions";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog"; // Import ConfirmationDialog

// CORRECTION: Correctly type ProfileRow to access row properties directly
type ProfileRow = UserProfilesWithEmail["Row"];

export function ImpersonationDialog({ profile }: { profile: ProfileRow }) {
  const t = useTranslations("app.dev-console.ImpersonationDialog");
  const [isPending, startTransition] = React.useTransition();

  const handleImpersonate = (formData: FormData) => {
    // The userId is now passed via hiddenInputs by ConfirmationDialog
    const userIdToImpersonate = formData.get("userId") as string;

    if (!userIdToImpersonate) {
      toast.error(t("default_error_toast"));
      return;
    }

    startTransition(async () => {
      const result = await adminActions.impersonateUserAction(formData); // Pass formData directly to the action
      if (result.success) {
        toast.success(t("success_toast"));
        // Assuming admin.actions.ts returns the signInLink directly in data
        window.open(result.data.signInLink, "_blank");
      } else {
        toast.error(result.error || t("default_error_toast"));
      }
    });
  };

  // CORRECTION: Ensure profile.email is not null for display
  const profileEmail = profile.email ?? t("unknown_email_fallback");

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
      icon={UserCog} // Using UserCog as the icon for impersonation dialog
      title={t("title")}
      description={t.rich("description", {
        email: profileEmail,
        strong: (chunks) => <strong>{chunks}</strong>,
      })}
      confirmButtonText={t("confirm_button")}
      cancelButtonText={t("cancel_button")}
      onConfirm={handleImpersonate}
      isPending={isPending}
      hiddenInputs={{ userId: profile.id ?? "" }} // Pass profile.id to the form
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
 * 1. **Atomicidade (SRP) e Reutilização**: ((Implementada)) Refatorado para usar o componente genérico `ConfirmationDialog`, reduzindo significativamente o LOC e melhorando a consistência da UI em diálogos de confirmação.
 * 2. **Correção de Tipos**: ((Implementada)) Corrigido o tipo `ProfileRow` para `UserProfilesWithEmail['Row']` e o acesso às propriedades `id` e `email`, resolvendo os erros `TS2339`.
 * 3. **Internacionalização Melhorada**: ((Implementada)) Todos os textos são agora consistentemente puxados da camada de i18n, incluindo `cancel_button` e `default_error_toast` (si se usa).
 *
 * @subsection Melhorias Futuras
 * 1. **Feedback Visual de Sucesso/Erro**: ((Vigente)) Aprimorar o `ConfirmationDialog` para exibir um feedback visual mais rico após a confirmação/cancelamento, talvez com um ícone de sucesso/erro e uma mensagem por um breve período.
 *
 * =====================================================================
 */
