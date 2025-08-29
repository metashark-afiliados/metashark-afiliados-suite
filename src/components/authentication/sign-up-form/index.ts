// src/components/authentication/sign-up-form/index.ts
/**
 * @file src/components/authentication/sign-up-form/index.ts
 * @description Manifiesto (Barrel File) y API pública para los componentes de campo
 *              atómicos del formulario de registro. Centraliza las exportaciones,
 *              adhiriéndose a la "Filosofía LEGO" para una máxima modularidad.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
export * from "./SignUpEmailField";
export * from "./SignUpPasswordField";
export * from "./SignUpConfirmPasswordField";
export * from "./SignUpLegalCheckboxes";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Generación Automática de Manifiestos:** Para una mantenibilidad de élite a largo plazo, este tipo de archivo "barrel" es un candidato ideal para ser generado y mantenido por un script (`pnpm gen:manifests`) que lea la estructura del directorio. Esto eliminaría la necesidad de actualizaciones manuales y prevendría errores de omisión.
 *
 * =====================================================================
 */
// src/components/authentication/sign-up-form/index.ts
