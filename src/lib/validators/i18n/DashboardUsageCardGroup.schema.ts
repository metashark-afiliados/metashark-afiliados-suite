/**
 * @file DashboardUsageCardGroup.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardUsageCardGroup'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la internacionalización de la tarjeta de métricas de uso.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const DashboardUsageCardGroupSchema = z.object({
  sites_active_title: z.string(),
  sites_active_change: z.string(),
  campaigns_published_title: z.string(),
  campaigns_published_change: z.string(),
  visitors_30d_title: z.string(),
  visitors_30d_change: z.string(),
  ai_credits_title: z.string(),
  ai_credits_change: z.string(),
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
