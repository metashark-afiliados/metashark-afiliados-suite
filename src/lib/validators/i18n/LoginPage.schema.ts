// src/lib/validators/i18n/LoginPage.schema.ts
/**
 * @file LoginPage.schema.ts
 * @description Define el contrato de datos para el namespace 'LoginPage',
 *              utilizado en la página de inicio de sesión dedicada.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const LoginPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  signInButton: z.string(),
  signInButton_pending: z.string(),
  alreadyHaveAccount: z.string(),
  error_invalid_credentials: z.string(),
  error_oauth_failed: z.string(),
  error_oauth_provider_missing: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Contrato Atómico**: ((Implementada)) Se ha creado el schema faltante, un paso crítico para la integridad del sistema i18n.
 * =====================================================================
 */
// src/lib/validators/i18n/LoginPage.schema.ts
