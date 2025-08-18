// src/components/onboarding/WelcomeModal.tsx
/**
 * @file src/components/onboarding/WelcomeModal.tsx
 * @description Modal de bienvenida para nuevos usuarios. Ha sido refactorizado
 *              para alinearse con el contrato de API canónico del componente
 *              `DialogContent`, resolviendo un error de tipo.
 * @author Raz Podestá
 * @version 1.1.0
 */
"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { completeOnboardingAction } from "@/lib/actions/onboarding.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboard } from "@/lib/context/DashboardContext";

export function WelcomeModal() {
  const { user } = useDashboard();
  const t = useTranslations("WelcomeModal"); // Asumiendo un namespace 'WelcomeModal'
  const [isOpen, setIsOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleContinue = () => {
    startTransition(async () => {
      const result = await completeOnboardingAction();
      if (result.success) {
        setIsOpen(false);
      } else {
        toast.error(t("errorToast"));
      }
    });
  };

  const username = user.user_metadata?.full_name || user.email;

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title", { username })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleContinue} disabled={isPending}>
            {t("ctaButton")}
          </Button>
        </DialogFooter>
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
 * 1. **Resolución de Error Crítico (TS2322)**: ((Implementada)) Se ha eliminado la prop inválida `showCloseButton`, resolviendo el error de compilación y alineando el componente con la API canónica de la librería de UI.
 *
 * @subsection Melhorias Futuras
 * 1. **Tour Guiado**: ((Vigente)) El `handleContinue` podría iniciar un tour guiado (ej. con `react-joyride`) además de cerrar el modal, para mejorar la experiencia del nuevo usuario.
 *
 * =====================================================================
 */
// src/components/onboarding/WelcomeModal.tsx
