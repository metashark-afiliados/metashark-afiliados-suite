// src/lib/validators/i18n/AboutPage.schema.ts
/**
 * @file AboutPage.schema.ts
 * @description Define el contrato de datos para el namespace 'AboutPage'.
 *              Sincronizado con la Directiva 3.4 (IMAS), validando arrays como
 *              objetos con claves numéricas para la compatibilidad con next-intl.
 * @author L.I.A Legacy
 * @version 4.0.0
 */
import { z } from "zod";

/**
 * @private
 * @constant MemberSchema
 * @description Define el contrato de datos para un único miembro del equipo.
 */
const MemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  imageUrl: z.string().url(),
  social: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }),
});

/**
 * @public
 * @constant AboutPageSchema
 * @description El schema Zod que valida la estructura completa del archivo de
 *              mensajes para la página "Sobre Nosotros".
 */
export const AboutPageSchema = z.object({
  hero: z.object({
    title: z.string(),
  }),
  mission: z.object({
    title: z.string(),
    // Validación de array como objeto con claves numéricas
    content: z
      .record(z.string())
      .describe("Objeto con claves numéricas para los párrafos."),
  }),
  team: z.object({
    title: z.string(),
    subtitle: z.string(),
    // Validación de array de objetos como un record
    members: z.record(MemberSchema),
  }),
});
// src/lib/validators/i18n/AboutPage.schema.ts