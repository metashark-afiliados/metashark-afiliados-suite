// tests/mocks/factories/index.ts
/**
 * @file tests/mocks/factories/index.ts
 * @description Manifiesto (Barrel File) purificado. Exporta únicamente
 *              factorías de datos y de construcción de estado.
 * @author Raz Podestá
 * @version 4.0.0
 */
export * from "./data.factory";
export * from "./context.factory";
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Purificación Arquitectónica**: ((Implementada)) Se ha eliminado la exportación incorrecta a `supabase.factory`, resolviendo el error `TS2307`.
 * =====================================================================
 */
// tests/mocks/factories/index.ts
