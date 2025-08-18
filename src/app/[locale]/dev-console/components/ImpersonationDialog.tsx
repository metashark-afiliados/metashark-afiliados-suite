// src/app/[locale]/dev-console/components/ImpersonationDialog.tsx
/**
 * @file ImpersonationDialog.tsx
 * @description Componente atómico para la funcionalidad de suplantación de usuario.
 *              Ha sido refactorizado para usar el componente genérico `ConfirmationDialogContent`,
 *              mejorando la reutilización y la consistencia de la UI, y resolviendo
 *              un error de importación de módulo.
 * @author Raz Podestá
 * @version 3.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { UserCog } from "lucide-react";
import React, { useState } from "react";

import { admin as adminActions } from "@/lib/actions";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";

type ProfileRow = UserProfilesWithEmail["Row"];

export function ImpersonationDialog({ profile }: { profile: ProfileRow }) {
  const t = useTranslations("app.dev-console.ImpersonationDialog");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleImpersonate = (formData: FormData) => {
    startTransition(async () => {
      const result = await adminActions.impersonateUserAction(formData);
      if (result.success) {
        toast.success(t("success_toast"));
        window.open(result.data.signInLink, "_blank");
        setIsOpen(false);
      } else {
        toast.error(t("default_error_toast"));
      }
    });
  };

  const profileEmail = profile.email ?? "unknown";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("aria_label", { email: profileEmail })}
        >
          <UserCog className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <ConfirmationDialogContent
        icon={UserCog}
        title={t("title")}
        description={t.rich("description", {
          email: profileEmail,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
        confirmButtonText={t("confirm_button")}
        cancelButtonText={t("cancel_button")}
        confirmButtonVariant="default"
        onConfirm={handleImpersonate}
        onClose={() => setIsOpen(false)}
        isPending={isPending}
        hiddenInputs={{ userId: profile.id ?? "" }}
      />
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato de Módulo**: ((Implementada)) Se ha actualizado la importación a `ConfirmationDialogContent`, resolviendo el error de build `Attempted import error`. El componente ahora gestiona su propio estado de diálogo, adhiriéndose al nuevo patrón de composición.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/components/ImpersonationDialog.tsx
