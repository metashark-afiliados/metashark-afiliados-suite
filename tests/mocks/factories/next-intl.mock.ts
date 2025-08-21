// tests/mocks/factories/next-intl.mock.ts
/**
 * @file tests/mocks/factories/next-intl.mock.ts
 * @description Factoría de mock atómica para la librería `next-intl`.
 *              Proporciona una simulación de alta fidelidad de los hooks `useTranslations`
 *              y `useFormatter`, permitiendo a los componentes renderizar textos de i18n
 *              en un entorno de prueba sin depender de la configuración completa de la librería.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { vi } from "vitest";

import * as DUMMY_DATA from "@tests/mocks/data/database-state";

/**
 * @public
 * @function setupNextIntlMock
 * @description Configura `vi.mock` para interceptar las importaciones de `next-intl`
 *              y reemplazarlas con implementaciones simuladas que devuelven claves de
 *              traducción predecibles para facilitar las aserciones en las pruebas.
 */
export const setupNextIntlMock = () => {
  vi.mock("next-intl", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next-intl")>();

    // Función 't' simulada de alta fidelidad
    const t = (key: string, values?: any) =>
      `[i18n] ${key}${values ? ` ${JSON.stringify(values)}` : ""}`;
    t.rich = (key: string, values: any) =>
      `[i18n] ${key} ${JSON.stringify(values || {})}`;
    t.raw = (key: string) => DUMMY_DATA.db; // Retorna datos crudos para pruebas que lo necesiten

    return {
      ...actual,
      useTranslations: (ns?: string) => {
        const s = (k: string, v?: any) => t(`${ns}.${k}`, v);
        s.rich = (k: string, v: any) => t.rich(`${ns}.${k}`, v);
        s.raw = (k: string) => t.raw(`${ns}.${k}`);
        return s;
      },
      useFormatter: () => ({
        dateTime: (d: Date) => d.toISOString(),
        relativeTime: (d: Date) => `[relative] ${d.toISOString()}`,
      }),
    };
  });
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidad y Cohesión**: ((Implementada)) La lógica de mock para `next-intl` está ahora completamente aislada en su propio módulo, mejorando la organización y el SRP.
 * 2. **Aislamiento de Mocks**: ((Implementada)) Como una pieza de "Lego" independiente, este mock puede ser importado y utilizado de forma aislada si una prueba solo necesita simular la internacionalización.
 *
 * @subsection Melhorias Futuras
 * 1. **Configurabilidad de Mensajes**: ((Vigente)) La factoría podría aceptar un objeto de mensajes de prueba como argumento para permitir que las pruebas anulen las claves de i18n con valores específicos para aserciones más precisas.
 * =====================================================================
 */
// tests/mocks/factories/next-intl.mock.ts
