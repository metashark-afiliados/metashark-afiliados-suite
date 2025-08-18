// src/lib/validators/i18n/SignUpPage.schema.ts
/**
 * @file src/lib/validators/i18n/SignUpPage.schema.ts
 * @description Define el contrato de datos para el namespace 'SignUpPage'.
 *              Ha sido sincronizado para incluir la clave `legalNotice`.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { z } from "zod";

export const SignUpPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  signUpButton: z.string(),
  alreadyHaveAccount: z.string(),
  legalNotice: z
    .string()
    .describe(
      "Aviso legal que contiene placeholders <terms> y <privacy> para enlaces."
    ),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) Se ha añadido la clave `legalNotice` al schema, resolviendo `IntlError: MISSING_MESSAGE` y sincronizando el schema con el uso real del componente `AuthFooter`.
 *
 * @subsection Melhorias Futuras
 * 1. **Contrato de Errores**: ((Vigente)) Añadir claves para mensajes de error específicos del flujo de registro.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SignUpPage.schema.ts
