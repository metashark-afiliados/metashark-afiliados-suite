// vitest.config.integration.ts
import { mergeConfig } from "vitest/config";
import baseConfig from "./vitest.config";

/**
 * @fileoverview Configuración de Vitest para pruebas de integración.
 * @description Este archivo extiende la configuración base (`vitest.config.ts`)
 * para definir el entorno y el alcance exclusivos de las pruebas de integración.
 * Su función es asegurar que el runner de Vitest solo ejecute los archivos
 * de prueba localizados en el directorio `tests/integration`. Esto permite
 * aislar pruebas más complejas y potencialmente más lentas, que verifican la
 * interacción entre múltiples componentes o aparatos.
 */
export default mergeConfig(baseConfig, {
  test: {
    include: ["tests/integration/**/*.test.ts?(x)"],
  },
});

/**
 * ##################################################################################
 * # CÓDIGO LEGADO                                                                  #
 * ##################################################################################
 *
 * Mejoras implementadas:
 *
 * ((Implementada)) Segregación de Pruebas de Integración: Se ha creado una suite
 *   dedicada para las pruebas de integración. Esto es crucial para mantener un
 *   ciclo de feedback rápido en las pruebas unitarias, mientras se permite una
 *   validación más exhaustiva de los flujos de interacción entre componentes.
 * ((Implementada)) Herencia de Configuración (DRY): Al extender la configuración
 *   base, se garantiza que los mismos estándares de calidad (cobertura, umbrales)
 *   se apliquen rigurosamente a las pruebas de integración.
 *
 * ##################################################################################
 * # MEJORA CONTINUA                                                                #
 * ##################################################################################
 *
 * Melhorias Futuras:
 *
 * ((Vigente)) Pipeline de CI Separado: Configurar un job en el pipeline de CI/CD
 *   que ejecute `test:integration` de forma separada, posiblemente en etapas
 *   posteriores a las pruebas unitarias (ej. pre-deploy), para optimizar el
 *   tiempo total del build.
 * ((Vigente)) Estandarización de Mocks de Servicios: Definir una estrategia
 *   centralizada para mockear servicios externos (APIs, bases de datos) usando
 *   herramientas como MSW (Mock Service Worker), y cargarla específicamente para
 *   esta suite de pruebas.
 *
 */
