// src/components/layout/sidebar/user-menu/UserMenuTrigger.tsx
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * @public
 * @interface UserMenuTriggerProps
 * @description Define el contrato de props para la primitiva de UI `UserMenuTrigger`.
 *              Extiende los atributos de un botón nativo.
 */
interface UserMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  userName: string;
  userEmail: string;
  userAvatarUrl: string;
}

/**
 * @public
 * @component UserMenuTrigger
 * @description Primitiva de UI atómica y de presentación pura. Su única
 *              responsabilidad es renderizar el botón visible que actúa como
 *              disparador para el menú de usuario. Es 100% agnóstico al estado
 *              y recibe todos los datos del usuario a través de props.
 * @param {UserMenuTriggerProps} props - Propiedades para configurar el disparador.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref reenviado al elemento button subyacente.
 * @returns {React.ReactElement} El componente de disparador del menú.
 * @author Raz Podestá
 * @version 1.0.0
 */
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
      <AvatarImage src={userAvatarUrl} alt={`Avatar de ${userName}`} />
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
 * 1. **Hiper-Atomicidad (SRP)**: ((Implementada)) Este componente aísla perfectamente la UI del disparador del menú, cumpliendo el Principio de Responsabilidad Única.
 * 2. **Primitiva de UI Robusta**: ((Implementada)) Al renderizar un `<button>` nativo y aplicar estilos con `buttonVariants`, se crea un componente más simple y robusto, previniendo errores de composición con `DropdownMenuTrigger`.
 * 3. **Full Internacionalización (Implícita)**: ((Implementada)) El componente es agnóstico al contenido. No contiene texto estático; `userName` y `userEmail` son datos dinámicos.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador de Estado**: ((Vigente)) Podría aceptar una prop `status: 'online' | 'offline'` para mostrar un pequeño indicador visual sobre el avatar, mejorando la comunicación del estado del usuario.
 *
 * =====================================================================
 */
