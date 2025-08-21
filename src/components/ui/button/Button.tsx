// src/components/ui/button/Button.tsx
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
 * 1. **Contrato de Tipos Consistente**: ((Implementada)) La estructura de tipos se ha simplificado para alinearse con la nueva API de variantes, asegurando la robustez.
 * =====================================================================
 */
