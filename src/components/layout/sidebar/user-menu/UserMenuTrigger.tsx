// src/components/layout/sidebar/user-menu/UserMenuTrigger.tsx
/**
 * @file UserMenuTrigger.tsx
 * @description Aparato de UI atómico y puro. Su única responsabilidad es
 *              renderizar el botón visual que abre el menú de usuario. Ha sido
 *              refactorizado a una primitiva pura que utiliza `buttonVariants`
 *              para erradicar de forma definitiva y sistémica el error TS2322.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  userName: string;
  userEmail: string;
  userAvatarUrl: string;
}

export const UserMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  UserMenuTriggerProps
>(({ userName, userEmail, userAvatarUrl, className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      buttonVariants({ variant: "ghost" }),
      "flex h-auto w-full items-center justify-start gap-3 p-2 text-left",
      className
    )}
    {...props}
  >
    <Avatar className="h-9 w-9">
      <AvatarImage src={userAvatarUrl} alt={userName} />
      <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
    <div className="overflow-hidden">
      <p className="truncate text-sm font-medium leading-none text-foreground">
        {userName}
      </p>
      <p className="truncate text-xs leading-none text-muted-foreground">
        {userEmail}
      </p>
    </div>
  </button>
));

UserMenuTrigger.displayName = "UserMenuTrigger";
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Erradicación Definitiva de TS2322**: ((Implementada)) Al renderizar un `<button>` nativo y aplicar estilos con `buttonVariants`, se elimina la cadena de `forwardRef` anidada, resolviendo la causa raíz del error de tipo de forma sistémica.
 * 2. **Desacoplamiento Superior (SOLID)**: ((Implementada)) El componente ya no depende de la implementación del `<Button>`, sino de la abstracción de sus estilos (`buttonVariants`), adhiriéndose al Principio de Inversión de Dependencia.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador de Estado**: ((Vigente)) Podría aceptar una prop `status: 'online' | 'offline'` para mostrar un pequeño indicador visual sobre el avatar.
 *
 * =====================================================================
 */
// src/components/layout/sidebar/user-menu/UserMenuTrigger.tsx
