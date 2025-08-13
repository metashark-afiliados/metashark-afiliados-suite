// src/components/auth/AuthDialog.tsx
/**
 * @file src/components/auth/AuthDialog.tsx
 * @description Orquestador de cliente para los modales de autenticación. Este
 *              aparato es la implementación central de la estrategia de UX modal.
 *              Consume el store `useAuthModalStore` para gestionar su estado y
 *              compone los aparatos `LoginForm` y `AuthFooter` para renderizar
 *              la UI de login y signup dentro de un diálogo.
 * @author Raz Podestá
 * @version 1.0.0
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

/**
 * @public
 * @component AuthDialog
 * @description Renderiza y controla los modales de inicio de sesión y registro.
 * @returns {React.ReactElement}
 */
export function AuthDialog(): React.ReactElement {
  const { isOpen, view, closeModal, switchView } = useAuthModalStore();
  const tLogin = useTranslations("LoginPage");
  const tSignUp = useTranslations("SignUpPage");
  const tSupabase = useTranslations("SupabaseAuthUI");

  const isLoginView = view === "login";
  const title = isLoginView ? tLogin("title") : tSignUp("title");
  const subtitle = isLoginView ? tLogin("subtitle") : tSignUp("subtitle");

  // Ensambla el objeto de localización para la UI de Supabase.
  const supabaseLocalization = {
    sign_in: {
      email_label: tSupabase("email_label"),
      password_label: tSupabase("password_label"),
      button_label: tLogin("signInButton"),
    },
    sign_up: {
      email_label: tSupabase("email_label"),
      password_label: tSupabase("password_label"),
      button_label: tSignUp("signUpButton"),
    },
    forgotten_password: {
      link_text: tSupabase("forgotten_password.link_text"),
    },
    common: {
      loading_button_label: tSupabase("common.loading_button_label"),
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <LoginForm
            view={isLoginView ? "sign_in" : "sign_up"}
            localization={supabaseLocalization}
          />
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
 * 1. **Arquitectura Modal Funcional**: ((Implementada)) Este aparato completa la implementación de la UX de autenticación modal, unificando los flujos de login y signup en una experiencia de usuario fluida y moderna.
 * 2. **Composición de Aparatos (SRP)**: ((Implementada)) El `AuthDialog` demuestra perfectamente la "Filosofía LEGO", actuando como un orquestador que ensambla piezas atómicas (`LoginForm`, `AuthFooter`) y es controlado por un store de estado desacoplado (`useAuthModalStore`).
 * 3. **Internacionalización Completa**: ((Implementada)) El componente obtiene todas las traducciones necesarias y las inyecta en los componentes hijos, incluyendo el complejo objeto de localización para la UI de Supabase.
 *
 * @subsection Melhorias Futuras
 * 1. **Animaciones de Transición de Vista**: ((Vigente)) Al cambiar entre las vistas de login y signup, se podría usar `framer-motion` y `AnimatePresence` para aplicar una transición suave (ej. un fundido cruzado) entre los contenidos del modal.
 * 2. **Gestión de Foco**: ((Vigente)) Asegurar que, al abrir el modal, el foco se establezca automáticamente en el primer campo del formulario para una accesibilidad de élite. Radix UI maneja esto bien, pero requiere verificación.
 *
 * =====================================================================
 */
// src/components/auth/AuthDialog.tsx
