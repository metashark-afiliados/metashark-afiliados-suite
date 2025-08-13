// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file src/lib/validators/i18n/SignUpPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SignUpPage'.
 *              Ha sido nivelado para la arquitectura de autenticación delegada,
 *              conteniendo solo los textos de la página contenedora y el
 *              AuthFooter.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant SignUpPageSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la página de registro.
 */
export const SignUpPageSchema = z.object({
  /** Título para la metadata de la página (ej. "Registrarse | ConvertiKit"). */
  metadataTitle: z.string(),
  /** Título principal mostrado en la página (ej. "Crea tu Cuenta"). */
  title: z.string(),
  /** Subtítulo o texto descriptivo debajo del título principal. */
  subtitle: z.string(),
  /** Texto para el botón de envío del formulario de Supabase UI. */
  signUpButton: z.string(),
  /** Texto que se muestra en el footer para cambiar a la vista de login. */
  alreadyHaveAccount: z.string(),
  /** Aviso legal en el footer que soporta texto enriquecido con enlaces. */
  legalNotice: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica**: ((Implementada)) El schema ha sido simplificado para reflejar la delegación de la UI del formulario a Supabase, mejorando la cohesión y eliminando claves obsoletas.
 *
 * @subsection Melhorias Futuras
 * 1. **Contrato de Errores**: ((Vigente)) Se podrían añadir claves para mensajes de error específicos del flujo de registro que puedan venir de la URL.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SignUpPage.schema.ts
