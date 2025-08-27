// src/lib/data/sites/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para el módulo de datos de
 *              sitios. Ensambla los aparatos de datos atómicos en una
 *              interfaz namespaced cohesiva, completando la refactorización
 *              holística del módulo.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import * as management from "./management.data";
import * as publicData from "./public.data";

export { management, publicData };
export * from "./types";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **API de Datos Cohesiva (Facade Pattern)**: Este manifiesto crea una API pública y namespaced (`sites.management`, `sites.publicData`) para el módulo de datos, mejorando drásticamente la organización y la legibilidad del código que lo consume.
 * 2. ((Implementada)) **Encapsulamiento de Módulo**: Al exportar solo lo necesario, este archivo oculta la estructura interna del módulo, adhiriéndose a los principios de encapsulamiento y proveyendo una fachada estable.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Generación Automática de Manifiestos**: Para una mantenibilidad de élite a largo plazo, este tipo de archivo "barrel" es un candidato ideal para ser generado y mantenido por un script (`pnpm gen:manifests`). Esto eliminaría la necesidad de actualizaciones manuales y prevendría errores de omisión de exportación.
 *
 * =====================================================================
 */
// src/lib/data/sites/index.ts
