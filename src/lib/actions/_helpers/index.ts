// src/lib/actions/_helpers/index.ts
/**
 * @file index.ts
 * @description Archivo barril para los helpers de Server Actions. Ha sido
 *              actualizado para exportar el nuevo `auth.helper`.
 * @author Raz Podestá
 * @version 2.2.0
 */
import "server-only";

export * from "./auth.helper";
export { createAuditLog } from "./audit-log.helper";
export { createPersistentErrorLog } from "./error-log.helper";
export { EmailService } from "./email-service.helper";
export { checkRateLimit } from "./rate-limiter.helper";
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización de Manifiesto**: ((Implementada)) Se ha añadido la exportación del nuevo helper `auth.helper`.
 *
 * =====================================================================
 */
// src/lib/actions/_helpers/index.ts