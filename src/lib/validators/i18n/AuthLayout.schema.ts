// src/lib/validators/i18n/AuthLayout.schema.ts
/**
 * @file AuthLayout.schema.ts
 * @description Define el contrato de datos para el namespace 'components.layout.AuthLayout'.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const AuthLayoutSchema = z.object({
  go_back_home_aria: z
    .string()
    .describe(
      "Texto accesible para el enlace del logo que lleva a la página de inicio."
    ),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Completitud de Contrato**: ((Implementada)) La creación de este schema completa otra brecha en la infraestructura de i18n, asegurando que todos los namespaces referenciados tengan un contrato de datos explícito.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/AuthLayout.schema.ts
