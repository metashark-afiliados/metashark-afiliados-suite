// src/components/authentication/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para el ecosistema de
 *              componentes de autenticación de élite. Sincronizado para eliminar
 *              la exportación del aparato obsoleto `authentication-form`.
 * @author Raz Podestá
 * @version 1.1.0
 */
export * from "./login-form";
export * from "./OAuthButtonGroup";
export * from "./OAuthButton";
export * from "./PasswordStrengthMeter";
export * from "./sign-up-form";

/**
 * =====================================================================
 *                           MEJORA CONTINua
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) Se ha eliminado la exportación del módulo obsoleto `authentication-form`, resolviendo el error de tipo TS2307 y limpiando la API pública del módulo.
 *
 * =====================================================================
 */
// src/components/authentication/index.ts
