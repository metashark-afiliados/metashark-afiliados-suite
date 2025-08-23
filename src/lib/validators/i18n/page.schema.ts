// src/lib/validators/i18n/page.schema.ts
/**
 * @file page.schema.ts
 * @description Define el contrato de datos para el namespace 'app.[locale].builder.page'.
 *              Este aparato atómico de validación es consumido por la infraestructura
 *              de i18n para garantizar la seguridad de tipos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const pageSchema = z.object({
  Header: z.object({
    back_to_dashboard: z.string(),
    back_to_dashboard_aria: z.string(),
    preview_button: z.string(),
    preview_aria: z.string(),
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve la última dependencia faltante para el script generador `generate-schema.ts`.
 * 2. **Atomicidad de Contrato**: ((Implementada)) El schema se enfoca únicamente en el contrato de datos para la página del constructor.
 *
 * @subsection Melhorias Futuras
 * 1. **Renombrar para Claridad**: ((Vigente)) El nombre del archivo `page.schema.ts` es genérico. Para una mantenibilidad de élite, debería ser renombrado a `builderPage.schema.ts` para reflejar con precisión su propósito y evitar futuras confusiones.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/page.schema.ts
