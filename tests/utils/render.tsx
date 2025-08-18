// tests/utils/render.tsx
/**
 * @file tests/utils/render.tsx
 * @description Utilidad de renderizado de élite definitiva. Ha sido refactorizado
 *              a la v4.0.0 para cargar dinámicamente los mensajes `.json` reales
 *              del sistema de i18n, proporcionando un entorno de pruebas de
 *              máxima fidelidad y eliminando la necesidad de mocks estáticos.
 * @author Raz Podestá
 * @version 4.0.0
 */
import React, { type ReactElement } from "react";
import {
  render as testingLibraryRender,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { NextIntlClientProvider } from "next-intl";
import { expect } from "vitest";
import fs from "fs";
import path from "path";

import { TooltipProvider } from "@/components/ui/tooltip";
import { setNestedProperty } from "@/lib/helpers/set-nested-property.helper";

expect.extend(toHaveNoViolations);

// --- Lógica de Carga de Mensajes de Alta Fidelidad ---

const messagesBasePath = path.resolve(__dirname, "../../src/messages");

/**
 * @private
 * @function loadMessages
 * @description Carga y parsea un archivo de mensajes .json para un namespace y locale específicos.
 * @param {string} namespace - La ruta relativa al archivo (ej. 'components/ui/Dialogs').
 * @param {string} locale - El locale a extraer (ej. 'es-ES').
 * @returns {Record<string, any>} Los mensajes para el namespace y locale.
 */
function loadMessages(namespace: string, locale: string): Record<string, any> {
  try {
    const filePath = path.join(messagesBasePath, `${namespace}.json`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileContent);
    return json[locale] || {};
  } catch (error) {
    console.error(`Error loading messages for namespace ${namespace}:`, error);
    return {};
  }
}

/**
 * @private
 * @function buildMessagesObject
 * @description Construye el objeto de mensajes anidado que `NextIntlClientProvider` espera.
 * @param {string[]} namespaces - Un array de namespaces a cargar.
 * @param {string} locale - El locale a utilizar.
 * @returns {Record<string, any>} El objeto de mensajes completo.
 */
function buildMessagesObject(
  namespaces: string[],
  locale: string
): Record<string, any> {
  const messages = {};
  namespaces.forEach((ns) => {
    const namespaceMessages = loadMessages(ns, locale);
    setNestedProperty(messages, ns.replace(/\//g, "."), namespaceMessages);
  });
  return messages;
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: string;
  namespaces?: string[];
}

const customRender = async (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): Promise<RenderResult> => {
  const { locale = "es-ES", namespaces = [] } = options;
  const messages = buildMessagesObject(namespaces, locale);

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        <TooltipProvider>{children}</TooltipProvider>
      </NextIntlClientProvider>
    );
  };

  const renderResult = testingLibraryRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

  const results = await axe(renderResult.container);
  expect(results).toHaveNoViolations();
  return renderResult;
};

export * from "@testing-library/react";
export { customRender as render };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Pruebas de Alta Fidelidad**: ((Implementada)) La utilidad `render` ahora carga dinámicamente los archivos `.json` reales, asegurando que las pruebas unitarias validen la integración con el contenido real de i18n.
 * 2. **Legibilidad y Mantenibilidad Mejoradas**: ((Implementada)) Las pruebas ahora pueden hacer aserciones sobre el texto visible real (ej. "Crear Workspace") en lugar de claves abstractas (`[i18n]...`). Esto las hace más fáciles de escribir y entender.
 * 3. **Eliminación de Deuda Técnica**: ((Implementada)) Se ha eliminado el objeto `MOCK_MESSAGES` estático, que era frágil y difícil de mantener.
 *
 * @subsection Melhorias Futuras
 * 1. **Caché de Mensajes**: ((Vigente)) Para optimizar la velocidad en suites de pruebas muy grandes, la función `loadMessages` podría cachear en memoria los archivos .json ya leídos.
 *
 * =====================================================================
 */
// tests/utils/render.tsx
