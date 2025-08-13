// src/lib/validators/i18n/DashboardPage.schema.ts
/**
 * @file DashboardPage.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardPage'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const DashboardPageSchema = z.object({
  error_title: z.string(),
  error_description: z.string(),
  tooltip: z.string(),
  welcomeMessage: z.string(),
  subtitle: z.string(),
  layoutSaveError: z.string(),
  RecentCampaigns: z.object({
    title: z.string(),
    emptyState: z.object({
      title: z.string(),
      ctaTitle: z.string(),
      ctaDescription: z.string(),
      ctaButton: z.string(),
    }),
    lastEdited: z.string(),
    preview: z.string(),
  }),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad**: ((Implementada)) Schema aislado para su namespace.
 * =====================================================================
 */
// src/lib/validators/i18n/DashboardPage.schema.ts
