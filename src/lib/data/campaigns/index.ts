/**
 * @file src/lib/data/campaigns/index.ts
 * @description Manifiesto (Barrel File) para los módulos de datos de campañas.
 *              Exporta los módulos atomizados bajo namespaces para un consumo
 *              limpio y organizado en las capas superiores.
 * @author Raz Podestá
 * @version 1.0.0
 */
export * as managementData from "./management.data";
export * as editorData from "./editor.data";
export * as publicData from "./public.data";
export * from "./types";
