// src/lib/data/index.ts
/**
 * @file src/lib/data/index.ts
 * @description Manifiesto de la Capa de Datos (Barrel File). Ha sido nivelado a
 *              un estándar de élite para consumir los manifiestos de sus módulos
 *              atomizados, resolviendo la ambigüedad de resolución de módulos
 *              que causaba la cascada de errores TS2306 y TS2305.
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import * as admin from "./admin";
import * as campaignsData from "./campaigns";
import * as modules from "./modules";
import * as notifications from "./notifications";
import * as permissions from "./permissions";
import * as sites from "./sites";
import * as workspaces from "./workspaces"; // Esta línea ahora resuelve al nuevo módulo atomizado.

export {
  admin,
  campaignsData,
  modules,
  notifications,
  permissions,
  sites,
  workspaces,
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 5.0.0
 * @date 2025-08-27
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consumo de Módulo Atómico**: ((Implementada)) Al eliminar el archivo monolítico `workspaces.ts`, la importación `import * as workspaces from "./workspaces"` ahora resuelve correctamente al nuevo manifiesto de módulo `workspaces/index.ts`. Esto completa la integración de la nueva arquitectura.
 * 2. **Consistencia Arquitectónica**: ((Implementada)) Toda la capa de datos ahora sigue un patrón consistente de módulos atomizados y re-exportación namespaced, mejorando drásticamente la mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo sigue siendo un candidato ideal para ser mantenido por un script que lea la estructura de directorios y genere las exportaciones, previniendo errores de omisión manual a medida que se atomizan otros módulos como `admin`.
 *
 * =====================================================================
 */
// src/lib/data/index.ts
