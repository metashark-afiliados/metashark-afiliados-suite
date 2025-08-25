// src/lib/validators/i18n/DashboardTutorialCard.schema.ts

/**
 * @file DashboardTutorialCard.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardTutorialCard'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la internacionalización de la tarjeta de tutoriales.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const DashboardTutorialCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
  buttonHref: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de UI Atómico**: ((Implementada)) Este nuevo schema crea un contrato de datos robusto y explícito para el componente, asegurando su completa internacionalización.
 *
 * =====================================================================
 */