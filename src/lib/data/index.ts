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
import * as workspaces from "./workspaces";

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
 * @subsection Melhorias Novas
 * 1. **Generación Automática**: ((Vigente)) Este archivo manifiesto es un candidato ideal para ser generado y mantenido por un script que lea la estructura de directorios y genere las exportaciones, previniendo errores de omisión manual a medida que se atomizan otros módulos como `admin`.
 *
 * =====================================================================
 */
// src/lib/data/index.ts
