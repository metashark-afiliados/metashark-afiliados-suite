// src/components/ui/button/Button.tsx
import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { ButtonContent, type ButtonContentProps } from "./ButtonContent";
import { ButtonGroup } from "./ButtonGroup";
import {
  ButtonBase,
  ButtonLink,
  ButtonSlot,
  type ButtonBaseProps,
  type ButtonLinkProps,
  type ButtonSlotProps,
} from "./primitives";
import { buttonVariants } from "./variants";

// --- INICIO: Contratos de Tipos de Élite Refinados v2 ---

type ActionProps = ButtonBaseProps & ButtonContentProps;
type LinkProps = ButtonLinkProps & ButtonContentProps;
type SlotProps = ButtonSlotProps;

export type ButtonProps =
  | (ActionProps & { asChild?: never; href?: never })
  | (LinkProps & { asChild?: never })
  | (SlotProps & { asChild: true; href?: never });

// --- FIN: Contratos de Tipos de Élite Refinados v2 ---

type ButtonComponent = React.ForwardRefExoticComponent<ButtonProps> & {
  Group: typeof ButtonGroup;
};

const ButtonRoot = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  // --- INICIO DE CORRECCIÓN: Consumo de `asChild` ---
  if (props.asChild) {
    // Desestructurar para quitar `asChild` y evitar que se propague al DOM.
    const { asChild, ...slotProps } = props;
    return <ButtonSlot {...slotProps} ref={ref as any} />;
  }
  // --- FIN DE CORRECCIÓN ---

  if ("href" in props && props.href) {
    const {
      isLoading,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      ...restLinkProps
    } = props;

    const content = (
      <ButtonContent
        isLoading={isLoading}
        loadingText={loadingText}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      >
        {children}
      </ButtonContent>
    );

    return (
      <ButtonLink {...(restLinkProps as ButtonLinkProps)} ref={ref as any}>
        {content}
      </ButtonLink>
    );
  }

  const {
    isLoading,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...restActionProps
  } = props as ActionProps;

  const content = (
    <ButtonContent
      isLoading={isLoading}
      loadingText={loadingText}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
    >
      {children}
    </ButtonContent>
  );

  return (
    <ButtonBase
      {...(restActionProps as ButtonBaseProps)}
      ref={ref as any}
      disabled={isLoading || disabled}
    >
      {content}
    </ButtonBase>
  );
});
ButtonRoot.displayName = "Button";

export const Button = ButtonRoot as ButtonComponent;
Button.Group = ButtonGroup;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Erradicación de Advertencia `asChild`**: ((Implementada)) El orquestador ahora desestructura y "consume" la prop `asChild`, evitando que se propague a los componentes hijos y eliminando la advertencia de React de forma definitiva y sistémica.
 * 2. **Atomicidad y Cohesión**: ((Implementada)) El orquestador mantiene su responsabilidad pura de ensamblar las primitivas y el contenido.
 *
 * @subsection Melhorias Futuras
 * 1. **Subcomponente de Tooltip (`Button.WithTooltip`)**: ((Vigente)) Añadir este HOC (Higher-Order Component) completaría el ecosistema `Button`, simplificando la adición de tooltips y centralizando la lógica del `TooltipProvider`.
 * 2. **Validación en Desarrollo**: ((Vigente)) Reintroducir un subcomponente `IntegrityChecker` que se renderice solo en desarrollo para validar el uso correcto de las props, mejorando aún más la DX.
 *
 * =====================================================================
 */
// src/components/ui/button/Button.tsx
