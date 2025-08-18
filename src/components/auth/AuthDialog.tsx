// src/components/auth/AuthDialog.tsx
/**
 * @file src/components/auth/AuthDialog.tsx
 * @description Orquestador de cliente para los modales de autenticación.
 *              Ha sido refactorizado para renderizar el nuevo `LoginForm`
 *              soberano sin pasarle props obsoletas.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { useAuthModalStore } from "@/lib/hooks/useAuthModalStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AuthFooter } from "./AuthFooter";
import { LoginForm } from "./LoginForm";

export function AuthDialog(): React.ReactElement {
  const { isOpen, view, closeModal, switchView } = useAuthModalStore();
  const tLogin = useTranslations("LoginPage");
  const tSignUp = useTranslations("SignUpPage");

  const isLoginView = view === "login";
  const title = isLoginView ? tLogin("title") : tSignUp("title");
  const subtitle = isLoginView ? tLogin("subtitle") : tSignUp("subtitle");

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        <div className="px-6">
          {/* --- INICIO DE CORRECCIÓN (RUPTURA DE CONTRATO) --- */}
          <LoginForm />
          {/* --- FIN DE CORRECCIÓN --- */}
        </div>
        <AuthFooter type={view} onSwitchView={switchView} />
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
 * 1. **Resolución de Ruptura de Contrato**: ((Implementada)) Se ha eliminado el paso de props obsoletas a `LoginForm`, resolviendo el error de tipo `TS2322`.
 *
 * @subsection Melhorias Futuras
 * 1. **Formularios Modales Dinámicos**: ((Vigente)) Renderizar condicionalmente `<LoginForm />` o un futuro `<SignUpForm />` basado en `view`.
 *
 * =====================================================================
 */
// src/components/auth/AuthDialog.tsx