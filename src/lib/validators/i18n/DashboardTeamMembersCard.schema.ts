/**
 * @file DashboardTeamMembersCard.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardTeamMembersCard'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la internacionalización de la tarjeta de miembros del equipo.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const DashboardTeamMembersCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  invite_button_aria: z.string(),
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
