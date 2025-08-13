// src/lib/validators/i18n/SocialProof.schema.ts
/**
 * @file src/lib/validators/i18n/SocialProof.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'SocialProof'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant SocialProofSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones de la sección de Prueba Social.
 */
export const SocialProofSchema = z.object({
  /** Título que se muestra encima de los logos, ej. "Con la confianza de...". */
  title: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad (IMAS)**: ((Implementada)) Schema aislado para su namespace, adhiriéndose a la arquitectura.
 * 2. **Completitud de Contrato**: ((Implementada)) La creación de este schema completa el conjunto de contratos de datos necesarios para la `HomePage`.
 *
 * @subsection Melhorias Futuras
 * 1. **Datos de Logos en i18n**: ((Vigente)) El schema podría expandirse para incluir un array de objetos de logos (`z.array(z.object({ name: z.string(), src: z.string() }))`), permitiendo que los logos sean gestionados desde el archivo de mensajes en lugar de estar codificados en `page.tsx`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SocialProof.schema.ts
