// tests/mocks/next-intl.mock.ts
/**
 * @file tests/mocks/next-intl.mock.ts
 * @description Mock de `next-intl` de élite, definitivo y de máxima fidelidad.
 *              Simula `useTranslations` y `useFormatter`, consumiendo los mensajes
 *              reales cacheados para replicar el comportamiento de la librería
 *              en el entorno de pruebas.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { vi } from "vitest";

import { getCachedTestMessagesForMock } from "@tests/utils/render";

// Función utilitaria para obtener un valor anidado de un objeto
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

/**
 * @private
 * @function createTranslateFunction
 * @description Crea y devuelve un objeto de función de traducción mockeado (`t`, `t.rich`, `t.raw`).
 * @param {Record<string, any>} messages - El objeto de mensajes precargados.
 * @param {string | undefined} namespace - El namespace opcional de la traducción.
 * @returns {any} Un objeto de función de traducción compatible con `useTranslations`.
 */
function createTranslateFunction(
  messages: Record<string, any>,
  namespace?: string
): any {
  const t = (key: string, values?: Record<string, any>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const message = getNestedValue(messages, fullKey);
    if (message === undefined) {
      // Para depuración, devolvemos una clave informativa.
      return `[MISSING_MESSAGE: ${fullKey}]`;
    }
    // Simplificación: solo devolvemos el string, sin interpolación real en el mock
    return typeof message === "string" ? message : `[i18n Object: ${fullKey}]`;
  };

  (t as any).rich = (key: string, values?: Record<string, any>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const message = getNestedValue(messages, fullKey);
    if (message === undefined) {
      return `[MISSING_MESSAGE_RICH: ${fullKey}]`;
    }
    // Simula el renderizado de texto enriquecido devolviendo el string base
    return message;
  };

  (t as any).raw = (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return getNestedValue(messages, fullKey) || {};
  };

  return t;
}

export const setupNextIntlMock = () => {
  vi.mock("next-intl", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next-intl")>();

    const mockUseTranslations = (namespace?: string) => {
      // Lee directamente de la caché poblada por el arnés de renderizado
      const messages = getCachedTestMessagesForMock() || {};
      return createTranslateFunction(messages, namespace);
    };

    return {
      ...actual,
      useTranslations: mockUseTranslations,
      useFormatter: () => ({
        dateTime: (d: Date) => d.toISOString(),
        relativeTime: (d: Date) => `[relative] ${d.toISOString()}`,
      }),
    };
  });

  vi.mock("@/lib/i18n/hooks", () => ({
    useTypedTranslations: vi.fn().mockImplementation((namespace: string) => {
      const messages = getCachedTestMessagesForMock() || {};
      return createTranslateFunction(messages, namespace);
    }),
  }));
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simulación de Alta Fidelidad**: ((Implementada)) ((Vigente)) El mock ahora consume los mensajes reales de los archivos `.json` a través de la caché, permitiendo que las pruebas hagan aserciones sobre textos reales y que los componentes se rendericen con su contenido final.
 * 2. **Sincronización del Sistema**: ((Implementada)) ((Vigente)) Este aparato completa la sincronización del sistema de pruebas, conectando el cargador de datos (`i18n.ts`), el orquestador (`vitest.setup.ts`) y el arnés de renderizado (`render.tsx`).
 *
 * @subsection Melhorias Futuras
 * 1. **Interpolación Real para `t()` y `t.rich()`**: ((Pendiente)) Para una fidelidad total, la simulación de `t` y `t.rich` podría ser mejorada para reemplazar placeholders como `{count}` con los valores proporcionados, replicando completamente la funcionalidad de `next-intl`.
 *
 * =====================================================================
 */
// tests/mocks/next-intl.mock.ts
