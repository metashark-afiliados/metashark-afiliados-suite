// src/components/authentication/index.ts
/**
 * @file src/components/authentication/index.ts
 * @description Manifiesto (Barrel File) y API pública para los componentes de
 *              UI del módulo de autenticación. Ha sido refactorizado
 *              holísticamente para exportar el orquestador `SignupForm` y sus
 *              componentes hijos, completando la API pública del módulo.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
export * from "./login-form";
export * from "./OAuthButtonGroup";
export * from "./OAuthButton";
export * from "./PasswordStrengthMeter";
export * from "./sign-up-form"; // Manifiesto de campos atómicos
export * from "./sign-up-form.tsx"; // Orquestador principal y sus tipos

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Exportaciones Nombradas Explícitas:** Para una máxima claridad de la API y para prevenir futuros conflictos de nombres, se podría refactorizar este manifiesto para usar exportaciones nombradas explícitas en lugar de `export *`. Por ejemplo: `export { LoginForm, type LoginFormProps } from "./login-form";`. Esto haría el contrato del módulo más legible y mantenible.
 * =====================================================================
 */
// src/components/authentication/index.ts
