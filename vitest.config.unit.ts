// vitest.config.unit.ts
import { mergeConfig } from "vitest/config";
import baseConfig from "./vitest.config";

/**
 * @fileoverview Configuración de Vitest para pruebas unitarias.
 * @description Este archivo extiende la configuración base (`vitest.config.ts`)
 * para definir el entorno y el alcance exclusivos de las pruebas unitarias.
 * Su principal responsabilidad es asegurar que el runner de Vitest solo
 * ejecute los archivos de prueba localizados en el directorio `tests/unit`.
 * Esto permite una ejecución rápida y enfocada, ideal para el desarrollo diario.
 */
export default mergeConfig(baseConfig, {
  test: {
    include: ["tests/unit/**/*.test.ts?(x)"],
  },
});

/**
 * ##################################################################################
 * # CÓDIGO LEGADO                                                                  #
 * ##################################################################################
 *
 * Mejoras implementadas:
 *
 * ((Implementada)) Segregación de Pruebas Unitarias: Se ha definido un scope
 *   exclusivo para las pruebas unitarias. Esto es fundamental para una estrategia
 *   de pruebas escalable, permitiendo ejecutar suites rápidas y específicas
 *   durante el desarrollo sin invocar pruebas más lentas (integración, E2E).
 * ((Implementada)) Herencia de Configuración (DRY): El aparato extiende la
 *   configuración base, adhiriendo al principio "Don't Repeat Yourself" y
 *   garantizando que los estándares de calidad (cobertura, umbrales) se apliquen
 *   consistentemente.
 *
 * ##################################################################################
 * # MEJORA CONTINUA                                                                #
 * ##################################################################################
 *
 * Melhorias Futuras:
 *
 * ((Vigente)) Optimización de Watch Mode: Crear un script npm `test:unit:watch`
 *   específico que utilice esta configuración para proporcionar feedback
 *   instantáneo a los desarrolladores mientras codifican.
 * ((Vigente)) Perfiles de Performance: A medida que la suite de pruebas unitarias
 *   crezca, investigar configuraciones de Vitest para optimizar la performance,
 *   tales como `threads` o `isolate: false` para escenarios específicos,
 *   evaluando siempre el trade-off con la fiabilidad de las pruebas.
 *
 */
