// src/components/workspaces/OnboardingDialog.tsx
/**
 * @file src/components/workspaces/OnboardingDialog.tsx
 * @description Aparato de UI atómico y de alta cohesión. Su única responsabilidad
 *              es gestionar y mostrar el diálogo de bienvenida y onboarding para
 *              nuevos usuarios. Ha sido refactorizado para utilizar `router.push`
 *              y corregir el flujo de redirección, además de alinearse con la API
 *              canónica del componente Dialog.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { useRouter } from "next/navigation";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTypedTranslations } from "@/lib/i18n/hooks";

import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

/**
 * @public
 * @component OnboardingDialog
 * @description Muestra un diálogo modal forzado para usuarios sin workspaces.
 *              Tras una creación exitosa, ejecuta una navegación completa al
 *              dashboard para reinicializar el estado de la aplicación.
 * @returns {React.ReactElement} El componente de diálogo de onboarding.
 */
export function OnboardingDialog(): React.ReactElement {
  const t = useTypedTranslations("WorkspaceSwitcher");
  const router = useRouter();

  const handleSuccess = () => {
    // CORRECCIÓN DE LÓGICA: Usar router.push para una navegación completa a la
    // nueva ruta, en lugar de router.refresh() que solo recarga los datos de la ruta actual.
    router.push("/dashboard");
  };

  return (
    <Dialog open={true}>
      {/*
        CORRECCIÓN DE CONTRATO: Se ha eliminado la prop inválida `showCloseButton={false}`.
        El diálogo no se puede cerrar porque su estado `open` está forzado a `true`
        y no se proporciona un callback `onOpenChange`.
      */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("onboarding_welcome_title")}</DialogTitle>
          <DialogDescription>
            {t("onboarding_welcome_description")}
          </DialogDescription>
        </DialogHeader>
        <CreateWorkspaceForm onSuccess={handleSuccess} />
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
 * 1. **Corrección de Flujo de Redirección**: ((Implementada)) El uso de `router.push('/dashboard')` resuelve el bug crítico que dejaba al usuario "pegado" en la página de bienvenida, completando el flujo de onboarding.
 * 2. **Corrección de Contrato de API**: ((Implementada)) Se ha eliminado la prop inválida `showCloseButton` del componente `DialogContent`, resolviendo el error de compilación `TS2322` y alineando el aparato con la API canónica de la librería de UI.
 *
 * @subsection Melhorias Futuras
 * 1. **Prueba E2E (Playwright)**: ((Vigente)) El flujo de onboarding es un candidato perfecto para una prueba End-to-End que simule el registro de un nuevo usuario y verifique que aterriza correctamente en el dashboard.
 * 2. **Tour Guiado**: ((Vigente)) El callback `onSuccess` podría iniciar un tour guiado (ej. con `react-joyride`) además de redirigir, para mejorar la experiencia del nuevo usuario.
 *
 * =====================================================================
 */
// src/components/workspaces/OnboardingDialog.tsx
