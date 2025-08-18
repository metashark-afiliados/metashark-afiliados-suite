// src/lib/validators/i18n/AboutPage.schema.ts
/**
 * @file AboutPage.schema.ts
 * @description Define el contrato de datos para el namespace 'AboutPage'.
 *              Sincronizado para reflejar la estructura anidada del contenido.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

export const AboutPageSchema = z.object({
  hero: z.object({
    title: z.string(),
  }),
  mission: z.object({
    title: z.string(),
    content: z.array(z.string()),
  }),
  team: z.object({
    title: z.string(),
    subtitle: z.string(),
    members: z.array(
      z.object({
        name: z.string(),
        role: z.string(),
        imageUrl: z.string(),
        social: z.object({
          linkedin: z.string().optional(),
          twitter: z.string().optional(),
        }),
      })
    ),
  }),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) El schema ahora refleja la estructura anidada real del archivo de mensajes, resolviendo el `IntlError`.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/AboutPage.schema.ts
