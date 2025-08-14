/**
 * @file src/lib/data/index.ts
 * @description Manifiesto de la Capa de Datos (Barrel File). Ha sido nivelado a
 *              un estándar de élite utilizando una exportación explícita para el
 *              módulo de campañas (`./campaigns/index`), eliminando la ambigüedad
 *              de resolución de módulos y resolviendo el error de compilación
 *              crítico `TS2339` de forma definitiva.
 * @author Raz Podestá
 * @version 3.0.0
 */
export * as admin from "./admin";
export * as campaignsData from "./campaigns/index"; 
export * as modules from "./modules";
export * as notifications from "./notifications";
export * as permissions from "./permissions";
export * as sites from "./sites";
export * as workspaces from "./workspaces";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Ambigüedad de Módulo**: ((Implementada)) La exportación `campaignsData` ahora apunta explícitamente a `./campaigns/index`. Esta es la corrección estructural definitiva que resuelve la causa raíz del error `TS2339`.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Este archivo sigue siendo un candidato ideal para ser mantenido por un script que lea la estructura de directorios y genere las exportaciones.
 *
 * =====================================================================
 */
// src/lib/data/index.ts
