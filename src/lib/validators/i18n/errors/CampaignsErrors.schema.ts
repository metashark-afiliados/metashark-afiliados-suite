// src/lib/validators/i18n/errors/CampaignsErrors.schema.ts
/**
 * @file CampaignsErrors.schema.ts
 * @description Aparato de validación atómico y SSoT. Define el contrato de datos
 *              completo para todos los mensajes de feedback de acciones de campañas,
 *              incluyendo claves de éxito y fracaso para todas las operaciones CRUD.
 * @author Raz Podesta - MetaShark Tech
 * @version 3.0.0
 */
import { z } from "zod";

export const CampaignsErrorsSchema = z.object({
  // --- Errores de Permisos y Estado ---
  /** Error cuando el usuario no tiene los permisos necesarios sobre la campaña o su workspace. */
  permission_denied: z.string(),
  /** Error cuando el usuario no tiene permisos sobre el sitio de destino para una asignación. */
  permission_denied_site: z.string(),
  /** Error cuando se intenta asignar una campaña que ya está asignada o no pertenece al usuario. */
  assignment_not_allowed: z.string(),
  /** Error cuando la campaña especificada no se encuentra. */
  not_found: z.string(),

  // --- Errores de Acción Genéricos ---
  /** Error genérico para fallos en la creación de una campaña. */
  create_failed: z.string(),
  /** Error genérico para fallos en la actualización de una campaña. */
  update_failed: z.string(),
  /** Error genérico para fallos en la eliminación de una campaña. */
  delete_failed: z.string(),
  /** Error genérico para fallos al archivar una campaña. */
  archive_failed: z.string(),
  /** Error genérico para fallos al duplicar una campaña. */
  duplicate_failed: z.string(),

  // --- Errores de Validación de Datos ---
  /** Error cuando se proporciona un ID de campaña con formato inválido. */
  invalid_id: z.string(),

  // --- Claves de éxito para toasts ---
  /** Mensaje de éxito para la creación de una campaña. */
  create_success: z.string(),
  /** Mensaje de éxito para el archivado de una campaña. */
  archive_success: z.string(),
  /** Mensaje de éxito para la eliminación de una campaña. */
  delete_success: z.string(),
  /** Mensaje de éxito para la duplicación de una campaña. */
  duplicate_success: z.string(),
});
// src/lib/validators/i18n/errors/CampaignsErrors.schema.ts
