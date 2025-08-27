/**
 * @file WelcomeHero.schema.ts
 * @description Define el contrato de datos para el namespace 'components.dashboard.WelcomeHero'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la internacionalización del componente WelcomeHero.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
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
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de UI Atómico**: ((Implementada)) Este nuevo schema crea un contrato de datos robusto y explícito para el componente, sentando las bases para su refactorización a un consumo de i18n soberano.
 * 2. **Documentación Embebida**: ((Implementada)) Se han añadido descripciones a cada propiedad para mejorar la DX y facilitar el trabajo de traducción.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Parámetros**: ((Vigente)) El schema para `title` podría ser mejorado para validar la presencia del marcador de posición `{username}`, garantizando que los archivos de mensajes no lo omitan accidentalmente.
 *
 * =====================================================================
 */
