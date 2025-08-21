// tests/mocks/factories/supabase/index.ts
/**
 * @file tests/mocks/factories/supabase/index.ts
 * @description Manifiesto (Barrel File) y API pública para el ecosistema
 *              de factorías de mocks de Supabase. Ensambla y exporta todas las
 *              piezas atómicas (`auth`, `query-builder`, `rpc`) para un consumo
 *              organizado por el ensamblador principal.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
export * from "./auth.mock";
export * from "./query-builder.mock";
export * from "./rpc.mock";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión de Módulo (LEGO)**: ((Implementada)) Este manifiesto agrupa las factorías de mocks de Supabase en un módulo cohesivo, mejorando la organización de la infraestructura de pruebas.
 *
 * @subsection Melhorias Futuras
 * 1. **Exportación Condicional**: ((Vigente)) Para proyectos con múltiples tipos de clientes Supabase (ej. `storage`), este manifiesto podría exportar factorías adicionales según sea necesario.
 *
 * =====================================================================
 */
