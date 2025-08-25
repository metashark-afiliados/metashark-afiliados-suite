// tests/mocks/next-intl.mock.ts
/**
 * @file next-intl.mock.ts
 * @description Mock de `next-intl` de élite. Refactorizado para simular las
 *              APIs de servidor (`unstable_setRequestLocale`, `getTranslations`),
 *              resolviendo errores de entorno de pruebas en Server Components.
 * @author L.I.A. Legacy
 * @version 4.0.0
 */
import { vi } from "vitest";
import { getCachedTestMessagesForMock } from "@tests/utils/render";

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function createTranslateFunction(
  messages: Record<string, any>,
  namespace?: string
): any {
  const t = (key: string, values?: Record<string, any>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    let message = getNestedValue(messages, fullKey);
    if (message === undefined) return `[MISSING_MESSAGE: ${fullKey}]`;

    if (typeof message === "string" && values) {
      Object.keys(values).forEach((valKey) => {
        message = message.replace(`{${valKey}}`, String(values[valKey]));
      });
    }
    return typeof message === "string" ? message : `[i18n Object: ${fullKey}]`;
  };

  (t as any).rich = (key: string, values?: Record<string, any>) =>
    t(key, values);
  (t as any).raw = (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return getNestedValue(messages, fullKey) || {};
  };
  return t;
}

export const setupNextIntlMock = () => {
  // --- MOCK PARA APIS DE CLIENTE ---
  vi.mock("next-intl", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next-intl")>();
    return {
      ...actual,
      useTranslations: (namespace?: string) => {
        const messages = getCachedTestMessagesForMock() || {};
        return createTranslateFunction(messages, namespace);
      },
      useFormatter: () => ({
        dateTime: (d: Date) => d.toISOString(),
        relativeTime: (d: Date) => `[relative] ${d.toISOString()}`,
      }),
    };
  });

  // --- MOCK PARA APIS DE SERVIDOR ---
  vi.mock("next-intl/server", () => ({
    unstable_setRequestLocale: vi.fn(),
    getTranslations: (namespace?: string | { namespace?: string }) => {
      const ns =
        typeof namespace === "object" ? namespace.namespace : namespace;
      const messages = getCachedTestMessagesForMock() || {};
      return Promise.resolve(createTranslateFunction(messages, ns));
    },
  }));

  vi.mock("@/lib/i18n/hooks", () => ({
    useTypedTranslations: vi.fn().mockImplementation((namespace: string) => {
      const messages = getCachedTestMessagesForMock() || {};
      return createTranslateFunction(messages, namespace);
    }),
  }));
};
