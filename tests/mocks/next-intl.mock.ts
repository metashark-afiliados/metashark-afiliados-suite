// tests/mocks/next-intl.mock.ts
/**
 * @file tests/mocks/next-intl.mock.ts
 * @description Mock de `next-intl` de élite, definitivo y de máxima fidelidad.
 *              Refactorizado para incluir lógica de interpolación de valores,
 *              aumentando la robustez y realismo del entorno de pruebas.
 * @author L.I.A. Legacy
 * @version 3.0.0
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
  vi.mock("next-intl", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next-intl")>();
    const mockUseTranslations = (namespace?: string) => {
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
 * 1. **Simulación de Interpolación**: ((Implementada)) El mock de `useTranslations` ahora realiza un reemplazo básico de placeholders (ej. `{year}`), haciendo que el entorno de pruebas sea significativamente más fiel al comportamiento de producción y permitiendo aserciones más intuitivas.
 *
 * =====================================================================
 */
