// src/lib/validators/i18n/WelcomeHero.schema.ts
/**
 * @file WelcomeHero.schema.ts
 * @description Define el contrato de datos para el namespace 'components.dashboard.WelcomeHero'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la internacionalización del componente WelcomeHero.
 *              **Actualizado para incluir la estructura de `search`**.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 */
import { z } from "zod";

export const WelcomeHeroSchema = z.object({
  title: z
    .string()
    .describe(
      "El saludo de bienvenida, ej: '¿Qué vamos a crear hoy, {username}?'"
    ),
  searchPlaceholder: z
    .string()
    .describe("El texto del placeholder para la barra de búsqueda."),
  tabs: z.object({
    myDesigns: z.string().describe("Etiqueta para la pestaña 'Mis Diseños'."),
    templates: z.string().describe("Etiqueta para la pestaña 'Plantillas'."),
    aiTools: z.string().describe("Etiqueta para la pestaña 'Herramientas IA'."),
  }),
  search: z.object({
    clear_aria: z
      .string()
      .describe("Texto accesible para el botón de limpiar búsqueda."),
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 *
 * @subsection Melhorias Novas
 * 1. **Validación de Parámetros**: ((Vigente)) El schema para `title` podría ser mejorado para validar la presencia del marcador de posición `{username}`, garantizando que los archivos de mensajes no lo omitan accidentalmente.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/WelcomeHero.schema.ts
