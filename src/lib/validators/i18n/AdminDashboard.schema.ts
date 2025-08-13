// src/lib/validators/i18n/AdminDashboard.schema.ts
/**
 * @file AdminDashboard.schema.ts
 * @description Define el contrato de datos para el namespace 'AdminDashboard'.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { z } from "zod";

export const AdminDashboardSchema = z.object({
  headerTitle: z.string(),
  headerDescription: z.string(),
  welcomeMessage: z.string(),
  signOutButton: z.string(),
  created: z.string(),
  visitSubdomain: z.string(),
  deleteButton: z.string(),
  deleteSiteAriaLabel: z.string(),
  deleteDialog: z.object({
    title: z.string(),
    description: z.string(),
    confirmButton: z.string(),
  }),
  noSubdomains: z.object({
    title: z.string(),
    description: z.string(),
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
// src/lib/validators/i18n/AdminDashboard.schema.ts
