// src/lib/validators/i18n/UserManagementTable.schema.ts
/**
 * @file UserManagementTable.schema.ts
 * @description Define el contrato de datos para el namespace 'app.dev-console.UserManagementTable'.
 *              Este aparato atómico de validación garantiza la seguridad de tipos
 *              para la tabla de gestión de usuarios.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

export const UserManagementTableSchema = z.object({
  table_header: z.object({
    email: z.string(),
    full_name: z.string(),
    role: z.string(),
    actions: z.string(),
  }),
  table_description: z.string(),
  search_placeholder: z.string(),
  clear_search_aria: z.string(),
  table_empty_state: z.string(),
  pagination: z.object({
    previousPageLabel: z.string(),
    nextPageLabel: z.string(),
    pageLabelTemplate: z.string(),
  }),
  role_update_success_toast: z.string(),
  role_update_error_toast: z.string(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Integridad**: ((Implementada)) La creación de este schema resuelve otra dependencia crítica para la infraestructura de i18n.
 *
 * @subsection Melhorias Futuras
 * 1. **Consistencia de Nomenclatura**: ((Vigente)) Considerar alinear los nombres de las claves de `pagination` con los de otros schemas (ej. `previous` en lugar de `previousPageLabel`) para una consistencia de élite en toda la base de código.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/UserManagementTable.schema.ts
