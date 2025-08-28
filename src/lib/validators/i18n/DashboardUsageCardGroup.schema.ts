// src/lib/validators/i18n/DashboardUsageCardGroup.schema.ts
/**
 * @file DashboardUsageCardGroup.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardUsageCardGroup'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la internacionalización de la tarjeta de métricas de uso.
 *              Ha sido refactorizado holísticamente para reflejar las nuevas
 *              claves de i18n que soportan valores dinámicos y contexto de plan.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const DashboardUsageCardGroupSchema = z.object({
  sites_active_title: z.string(),
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Claves dinámicas de cambio ---
  sites_active_change_free_plan: z.string().describe("Placeholder: {count}"),
  sites_active_change_pro_plan: z.string().describe("Placeholder: {count}"),
  campaigns_published_title: z.string(),
  campaigns_published_change: z.string().describe("Placeholder: {percent}"),
  visitors_30d_title: z.string(),
  visitors_30d_change: z.string().describe("Placeholder: {percent}"),
  ai_credits_title: z.string(),
  ai_credits_change_renews: z.string(),
  ai_credits_change_remaining: z.string().describe("Placeholder: {count}"),
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Contrato**: ((Implementada)) Se han actualizado las claves de `change` para reflejar que esperan placeholders (`{count}`, `{percent}`) y se han añadido las claves específicas por plan (`_free_plan`, `_pro_plan`). Esto alinea el esquema con el nuevo archivo de mensajes JSON.
 * 2. **Documentación de Placeholders**: ((Implementada)) Se ha añadido `.describe("Placeholder: {...}")` a las claves afectadas, proporcionando documentación explícita para los traductores y desarrolladores sobre las variables esperadas.
 * 3. **Integridad Holística**: ((Implementada)) Este cambio completa la alineación del esquema de i18n para la refactorización del componente de métricas de uso.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Placeholders**: ((Vigente)) Para una validación de élite, se podría considerar un `.refine()` en Zod para verificar que las cadenas de texto (`change`) realmente contienen los placeholders esperados (`{count}` o `{percent}`), previniendo errores de traducción o de omisión. Esto es una mejora avanzada que aumentaría la robustez del contrato.
 *
 * =====================================================================
 */
