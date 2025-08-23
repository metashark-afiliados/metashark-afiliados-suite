// src/components/authentication/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para el ecosistema de
 *              componentes de autenticación de élite. Consolida y exporta todos
 *              los aparatos atómicos relacionados con la autenticación,
 *              adhiriéndose a la "Filosofía LEGO" para una máxima modularidad y
 *              una interfaz de módulo limpia.
 * @author Raz Podestá
 * @version 1.0.0
 */
export * from "./authentication-form";
export * from "./login-form";
export * from "./OAuthButtonGroup";
export * from "./OAuthButton";
export * from "./PasswordStrengthMeter";
export * from "./sign-up-form";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión de Módulo**: ((Implementada)) Este nuevo aparato agrupa todos los componentes de autenticación en un único módulo cohesivo, mejorando la organización del proyecto y la Experiencia del Desarrollador (DX).
 * 2. **API Pública Explícita**: ((Implementada)) Define una interfaz clara para el módulo, encapsulando su estructura interna y facilitando su consumo por parte de otros componentes o módulos.
 *
 * @subsection Melhorias Futuras
 * 1. **Exportaciones Condicionales**: ((Vigente)) Para una encapsulación de élite, se podría considerar exportar los ensambladores (`login-form`, `sign-up-form`) por defecto y exportar los átomos (`OAuthButton`, etc.) bajo un namespace (ej. `Auth.OAuthButton`) para indicar que son partes internas del sistema.
 *
 * =====================================================================
 */
// src/components/authentication/index.ts
