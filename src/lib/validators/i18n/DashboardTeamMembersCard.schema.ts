// src/lib/validators/i18n/DashboardTeamMembersCard.schema.ts
/**
 * @file DashboardTeamMembersCard.schema.ts
 * @description Define el contrato de datos para el namespace 'DashboardTeamMembersCard'.
 *              Ha sido refactorizado holísticamente para incluir la clave `no_members_yet`,
 *              completando el contrato de i18n para la refactorización del componente.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const DashboardTeamMembersCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  invite_button_aria: z.string(),
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Adición de no_members_yet ---
  no_members_yet: z.string(),
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
 * 1. **Sincronización de Contrato**: ((Implementada)) Se ha añadido la clave `no_members_yet` al esquema, alineándolo con el archivo de mensajes `DashboardTeamMembersCard.json` y los requisitos del componente.
 * 2. **Integridad de Contrato**: ((Implementada)) El esquema ahora refleja con precisión el contrato de i18n del componente.
 *
 * @subsection Melhorias Futuras
 * 1. **Nombres de Roles Traducibles**: ((Vigente)) El esquema podría incluir claves para los nombres de roles (`role_owner`, `role_admin`, `role_member`) si se van a mostrar en la UI, garantizando la internacionalización completa de los roles.
 *
 * =====================================================================
 */
