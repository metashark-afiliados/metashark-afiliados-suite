// src/lib/validators/i18n/errors/OnboardingErrors.schema.ts
/**
 * @file OnboardingErrors.schema.ts
 * @description Aparato de validación atómico. Define el contrato de datos para
 *              mensajes de error de acciones de onboarding sin un prefijo de dominio.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const OnboardingErrorsSchema = z.object({
  unauthenticated: z.string(),
  update_failed: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad Radical (SRP)**: ((Implementada)) Este nuevo aparato encapsula los errores de onboarding, mejorando la modularidad.
 * 2. **Consistencia con Prefijos**: ((Implementada)) Las claves se definen sin prefijo, lo que permite que el ensamblador `ValidationErrors.schema.ts` aplique el prefijo `onboarding_` de forma consistente.
 *
 * @subsection Melhorias Futuras
 * 1. **Errores Específicos de Flujo de Onboarding**: ((Vigente)) Si el flujo de onboarding se vuelve más complejo (ej. creación de workspace fallida), se añadirán aquí los errores específicos.
 *
 * =====================================================================
 */
