// src/lib/validators/i18n/LoginForm.schema.ts
/**
 * @file LoginForm.schema.ts
 * @description Define el contrato de datos para el namespace 'components.auth.LoginForm'.
 *              Este aparato atómico de validación es consumido por la infraestructura
 *              de i18n para garantizar la seguridad de tipos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const LoginFormSchema = z.object({
  signInWith: z.string(),
  error_invalid_email: z.string(),
  error_password_required: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve una de las dependencias faltantes para el ensamblador `i18n.schema.ts`, un paso crítico para estabilizar el sistema de tipos de i18n.
 * 2. **Atomicidad de Contrato**: ((Implementada)) El schema se enfoca únicamente en su namespace, adhiriéndose a la arquitectura IMAS.
 *
 * @subsection Melhorias Futuras
 * 1. **Descripciones Detalladas**: ((Vigente)) Añadir `.describe()` a cada propiedad para proporcionar contexto a los traductores.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/LoginForm.schema.ts
