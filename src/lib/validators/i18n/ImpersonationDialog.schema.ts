// src/lib/validators/i18n/ImpersonationDialog.schema.ts
/**
 * @file ImpersonationDialog.schema.ts
 * @description Define el contrato de datos para el namespace 'app.dev-console.ImpersonationDialog'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para el modal de suplantación de identidad.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const ImpersonationDialogSchema = z.object({
  aria_label: z.string(),
  title: z.string(),
  description: z.string(),
  cancel_button: z.string(),
  confirm_button: z.string(),
  success_toast: z.string(),
  default_error_toast: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve otra dependencia crítica para la infraestructura de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Descripciones Detalladas**: ((Vigente)) Añadir `.describe()` a cada propiedad para proporcionar contexto a los traductores, especialmente para el texto `description` que soporta HTML.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/ImpersonationDialog.schema.ts
