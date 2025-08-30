// src/lib/data/admin/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para el módulo de datos de
 *              administración. Ensambla los aparatos de datos atómicos en una
 *              interfaz namespaced cohesiva, completando la refactorización
 *              holística del módulo `admin.ts` monolítico.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import "server-only";

import * as campaigns from "./campaigns.data";
import * as sites from "./sites.data";
import * as telemetry from "./telemetry.data";
import * as users from "./users.data";

export { users, campaigns, sites, telemetry };
export * from "./types";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1. **Generación Automática de Manifiestos**: Para una mantenibilidad de élite a largo plazo, este tipo de archivo "barrel" es un candidato ideal para ser generado y mantenido por un script (`pnpm gen:manifests`). Esto eliminaría la necesidad de actualizaciones manuales y prevendría errores de omisión de exportación.
 * 2. **Módulo de Auditoría**: Se podría crear un módulo `audit.data.ts` en este directorio para albergar la lógica de consulta de `audit_logs` para el Dev Console, y exportarlo aquí como `admin.audit`.
 * 3. **Módulo de Errores del Sistema**: De manera similar, se podría crear un `system_errors.data.ts` para consultar la tabla `system_errors` y exportarlo como `admin.systemErrors`.
 * 4. **Exportaciones Nombradas Explícitas**: Para una claridad máxima de la API, se podría refactorizar para usar exportaciones nombradas explícitas (`export { users } from './users.data'`) en lugar de `import * as`.
 * 5. **Documentación de API**: Añadir comentarios TSDoc a cada exportación para describir el propósito de cada sub-módulo (`users`, `campaigns`, etc.).
 * =====================================================================
 */
// src/lib/data/admin/index.ts
