// src/components/auth/AuthDialog.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthModalStore } from "@/lib/hooks/ui/useAuthModalStore";
import { clientLogger } from "@/lib/logging";
import { AuthFooter } from "./AuthFooter";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

/**
 * @public
 * @component AuthDialog
 * @description Orquestador de UI atómico para los modales de autenticación.
 *              Este aparato es un componente de cliente puro que se suscribe al
 *              `useAuthModalStore` para gestionar su estado. Su única responsabilidad
 *              es renderizar el contenedor del diálogo y componer el formulario
 *              apropiado (`LoginForm` o `SignUpForm`) basándose en la vista activa
 *              del store. Actúa como el ensamblador central para la UX de autenticación modal.
 * @returns {React.ReactElement} El componente de diálogo de autenticación.
 */
export function AuthDialog(): React.ReactElement {
  const { isOpen, view, closeModal, switchView } = useAuthModalStore();
  const tLogin = useTranslations("LoginPage");
  const tSignUp = useTranslations("SignUpPage");

  const isLoginView = view === "login";
  const title = isLoginView ? tLogin("title") : tSignUp("title");
  const subtitle = isLoginView ? tLogin("subtitle") : tSignUp("subtitle");

  clientLogger.trace(`[AuthDialog] Renderizando. Estado:`, { isOpen, view });

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          {isLoginView ? <LoginForm /> : <SignUpForm />}
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
 * 1. **Arquitectura Desacoplada**: ((Implementada)) El componente se suscribe al store de Zustand, eliminando la necesidad de `prop drilling` y permitiendo un control global del estado del modal.
 * 2. **Renderizado Condicional**: ((Implementada)) La lógica para mostrar el contenido correcto (login vs. signup) está centralizada aquí, basada en el estado del store.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Dinámica de Formularios**: ((Vigente)) Para una optimización de rendimiento de élite, los componentes `LoginForm` y `SignUpForm` pueden ser cargados dinámicamente con `React.lazy` o `next/dynamic`.
 * 2. **Transiciones de Vista Animadas**: ((Vigente)) Al cambiar entre la vista de `login` y `signup`, se podría utilizar `framer-motion` con `AnimatePresence` para crear una transición animada suave.
 *
 * =====================================================================
 */
