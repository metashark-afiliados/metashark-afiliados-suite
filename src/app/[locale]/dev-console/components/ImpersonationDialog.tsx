// src/app/[locale]/dev-console/components/ImpersonationDialog.tsx
"use client";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { UserCog } from "lucide-react";
import React, { useState } from "react";

import { impersonateUserAction } from "@/lib/actions/admin.actions";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationDialog";

type ProfileRow = UserProfilesWithEmail["Row"];

/**
 * @file ImpersonationDialog.tsx
 * @description Componente atómico para la funcionalidad de suplantación de usuario.
 *              Corregido para usar importaciones atómicas de Server Actions.
 * @author Raz Podestá
 * @version 3.1.0
 */
export function ImpersonationDialog({ profile }: { profile: ProfileRow }) {
  const t = useTranslations("app.dev-console.ImpersonationDialog");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleImpersonate = (formData: FormData) => {
    startTransition(async () => {
      const result = await impersonateUserAction(formData);
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
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("aria_label", { email: profileEmail })}
        onClick={() => setIsOpen(true)}
      >
        <UserCog className="h-4 w-4 text-muted-foreground" />
      </Button>
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
