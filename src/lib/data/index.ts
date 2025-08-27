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
// --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
// Se actualiza la importación para que apunte explícitamente al manifiesto
// del módulo 'sites'. Esto resuelve la ambigüedad entre el directorio 'sites/'
// y el archivo obsoleto 'sites.ts'. Ahora, cualquier importación de 'sites'
// desde este manifiesto recibirá la API namespaced correcta.
import * as sites from "./sites/index";
// --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
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
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Ambigüedad de Módulo**: La importación `sites` ahora apunta explícitamente a `./sites/index.ts`. Esta es la corrección estructural definitiva que resuelve la causa raíz del error `TS2306` y `TS2305`, asegurando que TypeScript siempre resuelva al manifiesto del módulo y no al archivo obsoleto.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Generación Automática**: Este archivo sigue siendo un candidato ideal para ser mantenido por un script que lea la estructura de directorios y genere las exportaciones, previniendo errores de omisión manual a medida que se atomizan otros módulos como `admin` y `workspaces`.
 *
 * =====================================================================
 */
// src/lib/data/index.ts
