// src/lib/validators/i18n/FeaturesSection.schema.ts
/**
 * @file FeaturesSection.schema.ts
 * @description Define el contrato de datos para el namespace 'FeaturesSection'.
 *              Ha sido nivelado a un estándar de élite para que 'features'
 *              sea un array de objetos, alineando el contrato con la lógica
 *              de renderizado del componente consumidor y la estructura del
 *              archivo de mensajes, resolviendo un `TypeError` en runtime.
 * @author Raz Podestá
 * @version 2.0.0
 */
import { z } from "zod";

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
      icon: z.string().describe("Nombre del icono de lucide-react."),
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
 * 1. **Sincronización de Contrato de Datos**: ((Implementada)) Se ha corregido el tipo de `features` de un objeto plano a `z.array(z.object(...))`, resolviendo la causa raíz del error de runtime `t.raw(...).map is not a function`.
 * 2. **Contrato de Alto Nivel**: ((Implementada)) La nueva estructura es más flexible y escalable, permitiendo añadir o eliminar características editando únicamente el archivo de mensajes sin necesidad de modificar el schema.
 * 3. **Documentación Embebida**: ((Implementada)) Se ha añadido documentación TSDoc y `.describe()` para mejorar la claridad del contrato.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Array No Vacío**: ((Vigente)) Se podría añadir `.nonempty()` al schema `features` para asegurar que siempre haya al menos una característica definida en los archivos de mensajes.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/FeaturesSection.schema.ts
