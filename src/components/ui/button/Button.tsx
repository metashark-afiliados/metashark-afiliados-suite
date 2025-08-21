// src/components/ui/button/Button.tsx
/**
 * @file Button.tsx
 * @description Orquestador de élite para el ecosistema Button. Ha sido
 *              refactorizado con una definición de tipos superior para resolver
 *              una cascada de errores de inferencia (TS2339), haciendo el
 *              contrato de props más robusto y predecible.
 * @author L.I.A. Legacy
 * @version 11.0.0
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

// --- INICIO: Contratos de Tipos de Élite Refinados v3 ---

// Se define explícitamente el tipo base para un botón de acción.
type ActionProps = ButtonBaseProps & ButtonContentProps;

// Se define el tipo para un botón que actúa como enlace.
type LinkProps = ButtonLinkProps & ButtonContentProps;

// Se define el tipo para un botón que clona a su hijo.
type SlotProps = ButtonSlotProps;

// La unión ahora es más clara.
export type ButtonProps =
  | (ActionProps & { asChild?: never; href?: never })
  | (LinkProps & { asChild?: never })
  | (SlotProps & { asChild: true; href?: never });

// --- FIN: Contratos de Tipos de Élite Refinados v3 ---

type ButtonComponent = React.ForwardRefExoticComponent<ButtonProps> & {
  Group: typeof ButtonGroup;
};

const ButtonRoot = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  if (props.asChild) {
    const { asChild, ...slotProps } = props;
    return <ButtonSlot {...slotProps} ref={ref as any} />;
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

  // --- INICIO DE CORRECCIÓN DE TIPO ---
  // Al llegar a esta rama, TypeScript sabe que ni `asChild` ni `href` están presentes,
  // por lo que puede inferir correctamente que `props` es del tipo `ActionProps`.
  // Ya no es necesario un `casting` con `Omit`.
  const {
    isLoading,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...restActionProps
  } = props;
  // --- FIN DE CORRECCIÓN DE TIPO ---

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
 * 1. **Resolución de Inferencia de Tipos (TS2339)**: ((Implementada)) Se ha reestructurado la unión de tipos `ButtonProps` y se ha eliminado el `Omit` problemático. Esto permite que el compilador de TypeScript infiera correctamente el tipo de `props` en cada rama lógica, resolviendo la cascada de errores.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación en Desarrollo**: ((Vigente)) Reintroducir un subcomponente `IntegrityChecker` que se renderice solo en desarrollo para validar el uso correcto de las props (`asChild` con `href`, etc.), mejorando la DX.
 *
 * =====================================================================
 */
// src/components/ui/button/Button.tsx
