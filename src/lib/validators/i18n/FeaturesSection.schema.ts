// src/lib/validators/i18n/FeaturesSection.schema.ts
/**
 * @file FeaturesSection.schema.ts
 * @description Define el contrato de datos para el namespace 'FeaturesSection'.
 *              Ha sido nivelado a un estándar de élite para validar el `icon`
 *              contra el enum Zod de iconos de Lucide, garantizando la
 *              integridad de los datos a nivel de SSoT.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { z } from "zod";
import { LucideIconNameSchema } from "@/config/lucide-icon-names"; // <-- Importación del nuevo SSoT

/**
 * @public
 * @constant FeaturesSectionSchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la sección de características.
 */
export const FeaturesSectionSchema = z.object({
  /** Título principal de la sección. */
  title: z.string(),
  /** Subtítulo o descripción de la sección. */
  subtitle: z.string(),
  /**
   * @property {z.ZodArray} features - Un array de objetos, donde cada objeto
   *           representa una única tarjeta de característica.
   */
  features: z.array(
    z.object({
      icon: LucideIconNameSchema.describe(
        "Nombre del icono de lucide-react, validado."
      ), // <-- BLINDAJE IMPLEMENTADO
      title: z.string(),
      description: z.string(),
    })
  ),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Blindaje de Contrato de Datos**: ((Implementada)) El campo `icon` ya no es un `z.string()` genérico. Ahora está validado por el `LucideIconNameSchema`, previniendo arquitectónicamente el uso de un nombre de icono inválido en los archivos de mensajes.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Array No Vacío**: ((Vigente)) Se podría añadir `.nonempty()` al schema `features` para asegurar que siempre haya al menos una característica definida en los archivos de mensajes.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/FeaturesSection.schema.ts
