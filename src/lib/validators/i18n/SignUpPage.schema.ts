// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file src/lib/validators/i18n/SignUpPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SignUpPage'.
 *              Ha sido sincronizado para incluir las claves utilizadas por
 *              el `AuthFooter`.
 * @author Raz Podestá
 * @version 3.1.0
 */
import { z } from "zod";

export const SignUpPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  signUpButton: z.string(),
  // --- INICIO DE CORRECCIÓN (SINCRONIZACIÓN DE CONTRATO) ---
  alreadyHaveAccount: z.string(),
  legalNotice: z.string(),
  // --- FIN DE CORRECCIÓN ---
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) Se han añadido las claves `alreadyHaveAccount` y `legalNotice`, resolviendo `IntlError: MISSING_MESSAGE` y sincronizando el schema con el uso real del `AuthFooter`.
 *
 * @subsection Melhorias Futuras
 * 1. **Contrato de Errores**: ((Vigente)) Añadir claves para mensajes de error específicos del flujo de registro.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SignUpPage.schema.ts
