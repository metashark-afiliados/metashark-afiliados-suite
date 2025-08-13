// src/lib/validators/i18n/SupabaseAuthUI.schema.ts
/**
 * @file src/lib/validators/i18n/SupabaseAuthUI.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'SupabaseAuthUI'.
 *              Este schema es la SSoT para todas las cadenas de texto que se inyectan
 *              directamente en el componente <Auth> de @supabase/auth-ui-react,
 *              permitiendo su completa internacionalización.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant SupabaseAuthUISchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              variables de localización de la UI de Supabase Auth.
 */
export const SupabaseAuthUISchema = z.object({
  /** Etiqueta para el campo de correo electrónico. */
  email_label: z.string(),
  /** Etiqueta para el campo de contraseña. */
  password_label: z.string(),
  /** Textos relacionados con el flujo de olvido de contraseña. */
  forgotten_password: z.object({
    link_text: z.string(),
  }),
  /** Textos comunes a varios flujos. */
  common: z.object({
    loading_button_label: z.string(),
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Contrato (IMAS)**: ((Implementada)) Se ha creado un schema atómico y de alta cohesión dedicado exclusivamente a los textos de la UI de Supabase, adhiriéndose a la arquitectura IMAS.
 * 2. **Desacoplamiento de Traducciones**: ((Implementada)) Este aparato permite que las páginas de `login` y `signup` construyan y pasen un objeto de localización a la UI de Supabase sin acoplarse a las claves de traducción de otras partes de la aplicación.
 *
 * @subsection Melhorias Futuras
 * 1. **Cobertura Completa**: ((Vigente)) El schema puede ser expandido para cubrir más variables de localización de la UI de Supabase a medida que sean necesarias (ej. mensajes de error, textos de proveedores OAuth).
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SupabaseAuthUI.schema.ts
