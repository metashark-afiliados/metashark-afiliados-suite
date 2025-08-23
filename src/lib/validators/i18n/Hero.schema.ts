// src/lib/validators/i18n/Hero.schema.ts
/**
 * @file Hero.schema.ts
 * @description Define el contrato de datos para el namespace 'components.landing.Hero'.
 *              Este aparato atómico de validación es consumido por la infraestructura
 *              de i18n para garantizar la seguridad de tipos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const HeroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve otra dependencia faltante para el ensamblador `i18n.schema.ts`, continuando con la estabilización del sistema de tipos.
 * 2. **Atomicidad de Contrato**: ((Implementada)) El schema se enfoca únicamente en su namespace, adhiriéndose a la arquitectura IMAS.
 *
 * @subsection Melhorias Futuras
 * 1. **Descripciones Detalladas**: ((Vigente)) Añadir `.describe()` a cada propiedad para proporcionar contexto a los traductores sobre el propósito de cada texto.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/Hero.schema.ts
