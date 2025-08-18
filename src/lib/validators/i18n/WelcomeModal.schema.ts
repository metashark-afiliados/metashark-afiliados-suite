// src/lib/validators/i18n/WelcomeModal.schema.ts
/**
 * @file WelcomeModal.schema.ts
 * @description Define el contrato de datos para el namespace 'WelcomeModal',
 *              utilizado en el flujo de onboarding.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const WelcomeModalSchema = z.object({
  title: z.string(),
  description: z.string(),
  ctaButton: z.string(),
  errorToast: z.string(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Onboarding**: ((Implementada)) Este schema atómico define el contrato para el `WelcomeModal`, permitiendo que la UI sea completamente internacionalizada.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/WelcomeModal.schema.ts