// src/lib/validators/i18n/BottomCTA.schema.ts
/**
 * @file src/lib/validators/i18n/BottomCTA.schema.ts
 * @description Define el contrato de datos atómico para el namespace de
 *              internacionalización 'BottomCTA'. Este schema es una pieza
 *              fundamental del contrato global de i18n.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

/**
 * @public
 * @constant BottomCTASchema
 * @description Define la estructura y los tipos de datos esperados para las
 *              traducciones relacionadas con la sección de Llamada a la Acción
 *              inferior de la página de inicio.
 */
export const BottomCTASchema = z.object({
  /** Título principal de la sección. */
  title: z.string(),
  /** Subtítulo o descripción de la sección. */
  subtitle: z.string(),
  /** Título para la lista de características incluidas. */
  featuresTitle: z.string(),
  /** Un array de strings, cada uno representando una característica. */
  features: z.array(z.string()),
  /** Texto para el botón de llamada a la acción principal. */
  ctaPrimaryText: z.string(),
  /** Placeholder para el campo de entrada de email. */
  ctaPlaceholderText: z.string(),
  /** Nota sobre el precio (ej. "Gratis para Siempre"). */
  pricingNote: z.string(),
  /** Nota sobre la garantía (ej. "Garantía de Satisfacción"). */
  guaranteeNote: z.string(),
  /** Nota sobre la tarjeta de crédito (ej. "No se requiere tarjeta"). */
  creditCardNote: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad de Contrato**: ((Implementada)) Este aparato aísla el contrato para el namespace `BottomCTA`, adhiriéndose a la arquitectura IMAS.
 * 2. **Documentación TSDoc de Élite**: ((Implementada)) Se ha añadido documentación verbosa y precisa para el schema y sus propiedades, mejorando la claridad para desarrolladores y traductores.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Longitud**: ((Vigente)) Se podrían añadir validaciones `.min(1)` a los campos de string para asegurar que las claves de traducción no estén vacías en los archivos de mensajes.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/BottomCTA.schema.ts
