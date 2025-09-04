// src/components/authentication/index.ts
/**
 * @file src/components/authentication/index.ts
 * @description Manifiesto (Barrel File) y API pública para los componentes de
 *              UI del módulo de autenticación. Es la SSoT para la exportación
 *              de todos los componentes del dominio de autenticación.
 * @author L.I.A. Legacy
 * @version 6.0.0
 */
export { LoginForm } from "./login-form";
export {
  OAuthButtonGroup,
  type OAuthButtonGroupProps,
} from "./OAuthButtonGroup";
export { OAuthButton, type OAuthButtonProps } from "./OAuthButton";
export { PasswordStrengthMeter } from "./PasswordStrengthMeter";

// Exporta el orquestador principal y sus tipos
export { SignupForm, type SignupFormProps } from "./sign-up-form";

// Exporta los campos atómicos y sus tipos desde su propio manifiesto
export * from "./sign-up-form/index";
// src/components/authentication/index.ts
