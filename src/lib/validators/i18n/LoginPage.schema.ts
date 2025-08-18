// src/lib/validators/i18n/LoginPage.schema.ts
/**
 * @file src/lib/validators/i18n/LoginPage.schema.ts
 * @description Define el contrato de datos para el namespace 'LoginPage'.
 *              Ha sido sincronizado para incluir la clave `dontHaveAccount`
 *              utilizada por el `AuthFooter`.
 * @author Raz Podestá
 * @version 2.1.0
 */
import { z } from "zod";

export const LoginPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  signInButton: z.string(),
  // --- INICIO DE CORRECCIÓN (SINCRONIZACIÓN DE CONTRATO) ---
  dontHaveAccount: z.string(),
  // --- FIN DE CORRECCIÓN ---
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) Se ha añadido la clave `dontHaveAccount`, resolviendo un `IntlError: MISSING_MESSAGE` y sincronizando el schema con el uso real del componente `AuthFooter`.
 *
 * @subsection Melhorias Futuras
 * 1. **Contrato de Errores de URL**: ((Vigente)) Añadir claves para los mensajes de error que se muestran cuando el `auth/callback` falla.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/LoginPage.schema.ts
