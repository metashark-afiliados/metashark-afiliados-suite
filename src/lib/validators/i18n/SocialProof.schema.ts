// src/lib/validators/i18n/SocialProof.schema.ts
/**
 * @file src/lib/validators/i18n/SocialProof.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'SocialProof'.
 *              Ha sido sincronizado para incluir el array de logos.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

export const SocialProofSchema = z.object({
  title: z.string(),
  logos: z.array(
    z.object({
      name: z.string(),
      src: z.string().url(),
    })
  ),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) El schema ahora requiere un array de `logos`, alineándolo con los requisitos del componente `SocialProof`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SocialProof.schema.ts
