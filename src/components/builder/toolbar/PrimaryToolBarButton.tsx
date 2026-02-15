// src/components/builder/toolbar/PrimaryToolBarButton.tsx
/**
 * @file PrimaryToolBarButton.tsx
 * @description Aparato de UI atómico y de presentación puro. Renderiza un único
 *              botón para la barra de herramientas principal del constructor.
 *              Es 100% agnóstico al estado, recibiendo su estado visual
 *              (activo/default) y callbacks a través de props. Utiliza CVA
 *              para una gestión de variantes de élite.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-24
 * @license MIT
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { type LucideIconName } from "@/config/lucide-icon-names";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex flex-col items-center justify-center h-16 w-full gap-1 rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted",
  {
    variants: {
      variant: {
        default: "",
        active: "bg-muted text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface PrimaryToolBarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  iconName: LucideIconName;
  label: string;
}

/**
 * @public
 * @component PrimaryToolBarButton
 * @description Renderiza un botón de herramienta individual para la barra lateral principal.
 *              Es un componente de presentación puro y controlado.
 * @param {PrimaryToolBarButtonProps} props - Propiedades para configurar el botón.
 * @returns {React.ReactElement}
 */
export const PrimaryToolBarButton = React.forwardRef<
  HTMLButtonElement,
  PrimaryToolBarButtonProps
>(({ className, variant, iconName, label, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    >
      <DynamicIcon name={iconName} className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
});
PrimaryToolBarButton.displayName = "PrimaryToolBarButton";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de UI Atómico (LEGO)**: ((Implementada)) Este componente encapsula perfectamente la presentación de un botón de herramienta, cumpliendo con la "Filosofía LEGO".
 * 2. **Estilo Declarativo con CVA**: ((Implementada)) Utiliza `class-variance-authority` para gestionar los estados visuales (`default`, `active`), creando una API de props limpia, predecible y escalable.
 * 3. **Full Internacionalización**: ((Implementada)) Es completamente agnóstico al contenido, recibiendo su `label` traducido desde el componente padre.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración con `<Tooltip>`**: ((Vigente)) Envolver el `<button>` en un `TooltipProvider` y `Tooltip` para mostrar el `label` como una ayuda visual al pasar el cursor, mejorando la usabilidad y la accesibilidad (a11y).
 * 2. **Indicador de Notificación**: ((Vigente)) Añadir una prop `hasNotification?: boolean` que, de ser `true`, renderice un pequeño punto de color en la esquina del icono, útil para herramientas con actualizaciones o nuevas funcionalidades.
 *
 * =====================================================================
 */
// src/components/builder/toolbar/PrimaryToolBarButton.tsx
