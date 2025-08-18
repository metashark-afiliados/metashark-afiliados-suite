// src/lib/validators/i18n/DashboardPage.schema.ts
/**
 * @file DashboardPage.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardPage'.
 *              Sincronizado con la arquitectura "Hub de Creación Soberano" v12.0.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { z } from "zod";

export const DashboardPageSchema = z.object({
  breadcrumbs: z.object({
    dashboard: z.string(),
  }),
  welcomeHero: z.object({
    title: z.string(),
    searchPlaceholder: z.string(), // Texto actualizado: "Personaliza tus campañas como quieras"
    tabs: z.object({
      myDesigns: z.string(),
      templates: z.string(),
      aiTools: z.string(),
    }),
  }),
  RecentActivity: z.object({
    title: z.string(),
    cardAriaLabel: z.string(),
    lastEdited: z.string(),
    no_recent_activity: z.string(),
  }),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación con PUV**: ((Implementada)) El schema ahora refleja el contrato para el nuevo `searchPlaceholder`, alineándose con la Propuesta Única de Valor.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/DashboardPage.schema.ts