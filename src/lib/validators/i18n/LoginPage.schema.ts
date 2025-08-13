// src/lib/validators/i18n/LoginPage.schema.ts
/**
 * @file src/lib/validators/i18n/LoginPage.schema.ts
 * @description Define el contrato de datos para el namespace 'LoginPage'.
 *              Ha sido nivelado para la arquitectura de autenticación delegada,
 *              conteniendo solo los textos de la página contenedora.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant LoginPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página de inicio de sesión.
 */
export const LoginPageSchema = z.object({
  /** Título para la metadata de la página (ej. "Iniciar Sesión | ConvertiKit"). */
  metadataTitle: z.string(),
  /** Título principal mostrado en la página (ej. "Bienvenido de nuevo"). */
  title: z.string(),
  /** Subtítulo o texto descriptivo debajo del título principal. */
  subtitle: z.string(),
  /** Texto para el botón de envío del formulario de Supabase UI. */
  signInButton: z.string(),
  /** Texto que se muestra en el footer para cambiar a la vista de registro. */
  dontHaveAccount: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica**: ((Implementada)) El schema ha sido simplificado para reflejar la delegación de la UI del formulario a Supabase.
 *
 * @subsection Melhorias Futuras
 * 1. **Contrato de Errores de URL**: ((Vigente)) Añadir claves para los mensajes de error que se muestran cuando el `auth/callback` falla (ej. `error_session_exchange_failed`).
 *
 * =====================================================================
 */
// src/lib/validators/i18n/LoginPage.schema.ts
