// src/lib/data/campaigns/index.ts
/**
 * @file src/lib/data/campaigns/index.ts
 * @description Manifiesto (Barrel File) para los módulos de datos de campañas.
 *              Exporta los módulos atomizados bajo namespaces para un consumo
 *              limpio y organizado en las capas superiores. Este aparato es el
 *              ensamblador que faltaba en la arquitectura de datos.
 * @author Raz Podestá
 * @version 1.0.0
 */
import * as editor from "./editor.data";
import * as management from "./management.data";
import * as publicData from "./public.data";

export { editor, management, publicData };
export * from "./types";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión Arquitectónica**: ((Implementada)) Este nuevo aparato completa la atomización de la capa de datos de campañas, proporcionando una API de datos namespaced y organizada.
 *
 * =====================================================================
 */
// src/lib/data/campaigns/index.ts
