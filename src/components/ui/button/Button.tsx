// src/components/ui/button/Button.tsx
/**
 * @file Button.tsx
 * @description Orquestador de UI polimórfico de élite para el componente Button.
 *              Ha sido refactorizado para aceptar las props `isLoading` y `loadingText`
 *              directamente en su API, centralizando la lógica de estado de carga
 *              y mejorando la DX.
 * @author L.I.A. Legacy
 * @version 12.0.0
 */
import * as React from "react";

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

// Contratos de props extendidos para incluir el estado de carga
type ActionProps = ButtonBaseProps & ButtonContentProps;
type LinkProps = ButtonLinkProps & ButtonContentProps;

export type ButtonProps =
  | (ActionProps & { asChild?: never; href?: never })
  | (LinkProps & { asChild?: never })
  | (ButtonSlotProps & { asChild: true; href?: never });

type ButtonComponent = React.ForwardRefExoticComponent<ButtonProps> & {
  Group: typeof ButtonGroup;
};

const ButtonRoot = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  if (props.asChild) {
    return <ButtonSlot {...props} ref={ref as any} />;
  }

  if ("href" in props && props.href) {
    const {
      isLoading,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      ...restLinkProps
    } = props;
    return (
      <ButtonLink {...(restLinkProps as ButtonLinkProps)} ref={ref as any}>
        <ButtonContent
          isLoading={isLoading}
          loadingText={loadingText}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        >
          {children}
        </ButtonContent>
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
  } = props;
  return (
    <ButtonBase
      {...(restActionProps as ButtonBaseProps)}
      ref={ref as any}
      disabled={isLoading || disabled}
    >
      <ButtonContent
        isLoading={isLoading}
        loadingText={loadingText}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      >
        {children}
      </ButtonContent>
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
 * 1. **API de Carga Centralizada**: ((Implementada)) El componente ahora acepta `isLoading` y `loadingText` en su API principal. Esto simplifica su uso, ya que el desarrollador no necesita pasar estas props al `ButtonContent` interno, y el estado `disabled` se gestiona automáticamente.
 *
 * @subsection Melhorias Futuras
 * 1. **Variantes de Spinner**: ((Vigente)) Añadir una prop `spinnerVariant` que permita cambiar el tipo de spinner de carga, ofreciendo mayor flexibilidad visual.
 *
 * =====================================================================
 */
// src/components/ui/button/Button.tsx
