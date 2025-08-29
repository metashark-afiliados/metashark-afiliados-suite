// src/lib/validators/i18n/DashboardTeamMembersCard.schema.ts
/**
 * @file DashboardTeamMembersCard.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardTeamMembersCard'.
 *              Ha sido refactorizado holísticamente para incluir la clave `no_members_yet`,
 *              completando el contrato de i18n para la refactorización del componente.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const DashboardTeamMembersCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  invite_button_aria: z.string(),
  unknown_member: z.string(),
  no_members_yet: z.string(),
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @section Melhorias Futuras
 * 1. ((Vigente)) **Internacionalización de Roles:** El esquema podría incluir claves para los nombres de roles (`role_owner`, `role_admin`, `role_member`) si se van a mostrar en la UI, garantizando la internacionalización completa.
 * =====================================================================
 */
// src/lib/validators/i18n/DashboardTeamMembersCard.schema.ts
