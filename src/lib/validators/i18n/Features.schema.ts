// src/lib/validators/i18n/Features.schema.ts
/**
 * @file Features.schema.ts
 * @description Define el contrato de datos para el namespace 'components.landing.Features'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos para la
 *              sección de características de la landing page.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

import { LucideIconNameSchema } from "@/config/lucide-icon-names";

export const FeaturesSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.array(
    z.object({
      icon: LucideIconNameSchema.describe(
        "Nombre del icono de lucide-react, validado."
      ),
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
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve la última dependencia faltante reportada para el ensamblador `i18n.schema.ts`.
 * 2. **Blindaje de Contrato de Datos**: ((Implementada)) El campo `icon` es validado por `LucideIconNameSchema`, previniendo arquitectónicamente el uso de un nombre de icono inválido en los archivos de mensajes.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Array No Vacío**: ((Vigente)) Se podría añadir `.nonempty()` al schema `features` para asegurar que siempre haya al menos una característica definida.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/Features.schema.ts
