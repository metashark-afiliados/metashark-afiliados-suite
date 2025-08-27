// src/lib/data/admin/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para el módulo de datos de
 *              administración. Ensambla los aparatos de datos atómicos en una
 *              interfaz namespaced cohesiva, completando la refactorización
 *              holística del módulo `admin.ts` monolítico.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
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
 *
 * @subsection Melhorias Adicionadas
 * 1. **API de Datos Cohesiva (Facade Pattern)**: ((Implementada)) Este manifiesto crea una API pública y namespaced (`admin.users`, `admin.campaigns`, etc.) para el módulo de datos de administración. Esto mejora drásticamente la organización, la legibilidad y la DX del código que lo consume.
 * 2. **Encapsulamiento de Módulo**: ((Implementada)) Al exportar solo lo necesario, este archivo oculta la estructura interna del módulo, adhiriéndose a los principios de encapsulamiento y proveyendo una fachada estable.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática de Manifiestos**: ((Vigente)) Para una mantenibilidad de élite a largo plazo, este tipo de archivo "barrel" es un candidato ideal para ser generado y mantenido por un script (`pnpm gen:manifests`). Esto eliminaría la necesidad de actualizaciones manuales y prevendría errores de omisión de exportación.
 *
 * =====================================================================
 */
// src/lib/data/admin/index.ts
