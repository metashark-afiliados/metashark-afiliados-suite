// src/lib/validators/i18n/NotFoundPage.schema.ts
/**
 * @file NotFoundPage.schema.ts
 * @description Define el contrato de datos para el namespace 'NotFoundPage'.
 *              Este schema valida las cadenas de texto utilizadas en la página 404.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const NotFoundPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  backToHome: z.string(),
  goToDashboard: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de UI Atómico**: ((Implementada)) Este nuevo schema crea un contrato de datos robusto y explícito para la página 404, permitiendo su completa internacionalización y resolviendo una brecha crítica del protocolo.
 *
 * @subsection Melhorias Futuras
 * 1. **Descripciones Detalladas**: ((Vigente)) Añadir `.describe()` a cada propiedad para proporcionar más contexto a los traductores sobre dónde y cómo se utiliza cada cadena de texto.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/NotFoundPage.schema.ts
