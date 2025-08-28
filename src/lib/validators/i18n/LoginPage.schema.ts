// src/lib/validators/i18n/LoginPage.schema.ts
/**
 * @file LoginPage.schema.ts
 * @description Define el contrato de datos consolidado y SSoT para el namespace
 *              'app.[locale].login.page', unificando todos los textos necesarios
 *              para la vista de inicio de sesión. Ha sido refactorizado holísticamente
 *              para **eliminar las claves de error** que ahora residen en
 *              `ValidationErrors.schema.ts`, centralizando la SSoT de los errores.
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const LoginPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  email_label: z.string(),
  password_label: z.string(),
  forgot_password_link: z.string(),
  signInButton: z.string(),
  signInButton_pending: z.string(),
  signInWith: z.string(),
  signInWithProvider: z.string().describe("Ej: 'Continuar con {provider}'"),
  dontHaveAccount: z.string(),
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Eliminación de claves de error ---
  // Claves movidas a shared.ValidationErrors.json para centralización.
  // "error_invalid_credentials": z.string(),
  // "error_oauth_failed": z.string(),
  // "error_oauth_provider_missing": z.string(),
  // "error_profile_creation_failed": z.string(),
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 4.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Centralización de Errores**: ((Implementada)) Se han eliminado las propiedades de error del esquema, ya que ahora se gestionan en `ValidationErrors.schema.ts`. Esto refuerza la SSoT para los errores de validación y de acción.
 * 2. **Coherencia Arquitectónica**: ((Implementada)) El esquema `LoginPage.schema.ts` ahora se centra exclusivamente en los textos de UI de la página, mejorando la coherencia y el principio DRY.
 * 3. **Tipado Consistente**: ((Implementada)) La eliminación de estas propiedades del esquema asegura que los componentes que consumen `LoginPage.schema.ts` solo esperen las propiedades correctas.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de `forgot_password_link`**: ((Vigente)) La clave `forgot_password_link` podría ser validada como `z.string().url()` si siempre debe ser una URL, para aumentar la robustez.
 *
 * =====================================================================
 */
