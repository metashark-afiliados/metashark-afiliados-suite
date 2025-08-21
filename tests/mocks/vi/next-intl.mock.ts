// tests/mocks/vi/next-intl.mock.ts
/**
 * @file tests/mocks/vi/next-intl.mock.ts
 * @description Mock de `next-intl` de élite y alta fidelidad. Consume un objeto
 *              de mensajes simulado para replicar el comportamiento real, incluyendo
 *              el renderizado de texto enriquecido (`t.rich`).
 * @author Raz Podestá
 * @version 5.0.0
 */
import React from "react";
import { vi } from "vitest";
import { get } from "lodash";

import { db } from "@tests/mocks/data/database-state";

// SSoT para los mensajes de prueba. Contiene el texto real que las pruebas pueden necesitar.
const MOCK_MESSAGES = {
  WorkspaceSwitcher: {
    delete_dialog: {
      title: "Delete Workspace",
      description:
        "This is a permanent action. All sites and campaigns within <strong>{workspaceName}</strong> will be deleted.",
      confirmation_label:
        "To confirm, type <strong>{workspaceName}</strong> below:",
      confirm_button: "Yes, delete workspace",
    },
  },
  Dialogs: {
    generic_cancelButton: "Cancel",
  },
  ValidationErrors: {
    name_required: "Name is required.",
    name_too_short: "Name must be at least 3 characters.",
  },
};

export const setupNextIntlMock = () => {
  vi.mock("next-intl", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next-intl")>();

    const t = (key: string, values?: Record<string, any>) => {
      const message = get(MOCK_MESSAGES, key, `[i18n] ${key}`);
      if (!values) return message;
      return Object.entries(values).reduce(
        (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
        message
      );
    };

    t.rich = (key: string, values?: Record<string, any>) => {
      const message = get(MOCK_MESSAGES, key, `[i18n-rich] ${key}`);
      if (!values) return message;

      const tagRegex = /<(\w+)>(.*?)<\/\1>/g;
      const parts = message.split(tagRegex);

      const messageWithPlaceholders = parts.map((part, index) => {
        if (index % 3 === 2) {
          const tagName = parts[index - 1] as keyof typeof values;
          const renderFn = values[tagName];
          if (typeof renderFn === "function") {
            return React.cloneElement(renderFn(part), { key: index });
          }
        }
        if (index % 3 === 0) {
          return part.replace(
            /\{(\w+)\}/g,
            (_, placeholder) => values[placeholder] || `{${placeholder}}`
          );
        }
        return null;
      });

      return React.createElement(
        React.Fragment,
        null,
        ...messageWithPlaceholders
      );
    };

    t.raw = (key: string) => get(MOCK_MESSAGES, key, {});

    return {
      ...actual,
      useTranslations: (ns?: string) => {
        const s = (k: string, v?: any) => t(`${ns}.${k}`, v);
        s.rich = (k: string, v?: any) => t.rich(`${ns}.${k}`, v);
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
 *
 * @subsection Melhorias Adicionadas
 * 1. **Mock de `t.rich` de Alta Fidelidad**: ((Implementada)) El mock ahora procesa los placeholders y las etiquetas de formato (ej. `<strong>`), generando un `ReactNode` que replica el comportamiento de `next-intl` en producción y previene errores de renderizado en las pruebas.
 * 2. **Consumo de SSoT de Mensajes**: ((Implementada)) El mock consume un objeto `MOCK_MESSAGES` que puede ser expandido para proporcionar textos reales a las pruebas, mejorando la fidelidad de las aserciones.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Dinámica de Mensajes de Prueba**: ((Vigente)) Para pruebas de integración de mayor escala, este mock podría ser mejorado para cargar dinámicamente archivos `.json` de `src/messages` en lugar de usar un objeto estático.
 *
 * =====================================================================
 */
// tests/mocks/vi/next-intl.mock.ts