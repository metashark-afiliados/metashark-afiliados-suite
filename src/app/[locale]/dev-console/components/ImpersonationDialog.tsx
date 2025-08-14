// src/app/[locale]/dev-console/components/ImpersonationDialog.tsx
/**
 * @file ImpersonationDialog.tsx
 * @description Componente atómico para la funcionalidad de suplantación de usuario.
 *              Gestiona la UI del diálogo de confirmación y la invocación de la
 *              Server Action `impersonateUserAction`.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Loader2, UserCog } from "lucide-react";

import { admin as adminActions } from "@/lib/actions";
import { type UserProfilesWithEmail } from "@/lib/types/database/views";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ProfileRow = UserProfilesWithEmail;

export function ImpersonationDialog({ profile }: { profile: ProfileRow }) {
  const t = useTranslations("app.dev-console.ImpersonationDialog");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleImpersonate = () => {
    if (!profile.id) return;
    startTransition(async () => {
      const result = await adminActions.impersonateUserAction(profile.id!);
      if (result.success) {
        toast.success(t("success_toast"));
        window.open(result.data.signInLink, "_blank");
        setIsOpen(false);
      } else {
        toast.error(result.error || t("default_error_toast"));
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("aria_label", {
            email: profile.email,
          })}
        >
          <UserCog className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t.rich("description", {
              email: profile.email,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            {t("cancel_button")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleImpersonate}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("confirm_button")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (SRP)**: ((Implementada)) El componente encapsula una única funcionalidad de alto riesgo, facilitando su auditoría y mantenimiento.
 * 2. **Full Internacionalización**: ((Implementada)) Todos los textos, incluyendo los `aria-labels` y los mensajes de `toast`, son consumidos desde la capa de i18n.
 * 3. **Feedback de Usuario de Élite**: ((Implementada)) Utiliza `useTransition` para gestionar el estado de carga y `toast` para comunicar el resultado de la operación.
 *
 * @subsection Melhorias Futuras
 * 1. **Abstracción a `ConfirmationDialog`**: ((Vigente)) Este diálogo sigue un patrón común. Podría ser refactorizado para usar un futuro componente `ConfirmationDialog` genérico, pasándole los textos y la acción `onConfirm` como props para reducir la duplicación de código.
 *
 * =====================================================================
 */
// src/app/[locale]/dev-console/components/ImpersonationDialog.tsx
