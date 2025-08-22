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
// import { SignUpForm } from './SignUpForm'; // Se añadirá en un futuro aparato

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
          {/* Renderizado condicional del formulario */}
          {
            isLoginView ? (
              <LoginForm />
            ) : (
              <LoginForm />
            ) /* Placeholder para SignUpForm */
          }
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
 * 2. **Renderizado Condicional**: ((Implementada)) La lógica para mostrar el título y subtítulo correctos (login vs. signup) está centralizada aquí, basada en el estado del store.
 * 3. **Composición Atómica (LEGO)**: ((Implementada)) Actúa como un ensamblador puro, componiendo los aparatos atómicos `LoginForm` y `AuthFooter` en una unidad funcional cohesiva.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Dinámica de Formularios**: ((Vigente)) Para una optimización de rendimiento de élite, los componentes `LoginForm` y `SignUpForm` pueden ser cargados dinámicamente con `React.lazy` o `next/dynamic`. Esto aseguraría que el código JavaScript para los formularios solo se cargue cuando el usuario abra el modal, reduciendo el tamaño del bundle inicial de la página.
 * 2. **Transiciones de Vista Animadas**: ((Vigente)) Al cambiar entre la vista de `login` y `signup`, se podría utilizar `framer-motion` con `AnimatePresence` para crear una transición animada suave (ej. un fundido o un deslizamiento lateral) entre los formularios, mejorando la calidad percibida de la UI.
 * 3. **Contexto de Invocación**: ((Vigente)) El store `useAuthModalStore` podría ser extendido para aceptar un payload opcional (ej. `openModal('login', { title: 'Tu sesión ha expirado' })`). Este componente podría leer ese payload y sobrescribir los títulos por defecto para proporcionar un feedback más contextual al usuario.
 *
 * =====================================================================
 */
// src/components/auth/AuthDialog.tsx
