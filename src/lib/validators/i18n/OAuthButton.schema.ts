// src/lib/validators/i18n/OAuthButton.schema.ts
/**
 * @file OAuthButton.schema.ts
 * @description Define el contrato de datos para el namespace 'components.auth.OAuthButton'.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const OAuthButtonSchema = z.object({
  signInWithProvider: z.string().describe("Ej: 'Continuar con {provider}'"),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Completitud de Contrato**: ((Implementada)) La creación de este schema completa una de las brechas finales en la infraestructura de i18n, permitiendo que el `i18n.schema.ts` sea generado de forma completa y correcta.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/OAuthButton.schema.ts
