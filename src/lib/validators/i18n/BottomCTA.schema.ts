// src/lib/validators/i18n/BottomCTA.schema.ts
/**
 * @file BottomCTA.schema.ts
 * @description Define el contrato de datos atómico para el namespace 'BottomCTA'
 *              dentro de `landing.json`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
import { z } from "zod";

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
// src/lib/validators/i18n/BottomCTA.schema.ts
