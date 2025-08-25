// src/components/onboarding/WelcomeModal.tsx
/**
 * @file src/components/onboarding/WelcomeModal.tsx
 * @description Modal de bienvenida para nuevos usuarios. Ha sido refactorizado
 *              para alinearse con el contrato de API canónico del componente
 *              `DialogContent`, resolviendo un error de tipo.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
import { logger } from "@/lib/logging";

export function WelcomeModal() {
  const { user } = useDashboard();
  const t = useTranslations("shared.WelcomeModal");
  const [isOpen, setIsOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleContinue = () => {
    logger.trace("[WelcomeModal] El usuario ha completado el onboarding.");
    startTransition(async () => {
      const result = await completeOnboardingAction();
      if (result.success) {
        setIsOpen(false);
      } else {
        toast.error(t("errorToast"));
      }
    });
  };

  const username = user?.user_metadata?.full_name || user?.email || "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* --- INICIO DE CORRECCIÓN DE TIPO --- */}
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        {/* --- FIN DE CORRECCIÓN DE TIPO --- */}
        <DialogHeader>
          <DialogTitle>{t("title", { username })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleContinue}
            disabled={isPending}
            isLoading={isPending}
          >
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
 * 1. **Resolución de Error Crítico (TS2322)**: ((Implementada)) Se ha eliminado la prop inválida `showCloseButton` y se ha añadido `onInteractOutside={(e) => e.preventDefault()}` para prevenir que el modal se cierre al hacer clic fuera, logrando el comportamiento deseado sin violar el contrato de la API.
 *
 * @subsection Melhorias Futuras
 * 1. **Tour Guiado**: ((Vigente)) El `handleContinue` podría iniciar un tour guiado (ej. con `react-joyride`) por la interfaz del dashboard.
 *
 * =====================================================================
 */
// src/components/onboarding/WelcomeModal.tsx
