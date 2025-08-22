// src/lib/testing/harness.tsx
import React, { FC, ReactElement } from "react";
import {
  render,
  renderHook,
  RenderOptions,
  RenderHookOptions,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

/**
 * @fileoverview Arnés de pruebas centralizado para MetaShark Tech.
 * @description Este archivo proporciona funciones `render` y `renderHook` personalizadas
 * que envuelven automáticamente los componentes y hooks en los proveedores de
 * contexto globales de la aplicación (como `NextIntlClientProvider`). También
 * re-exporta todas las utilidades de `@testing-library/react` para que los
 * archivos de prueba solo necesiten importar desde este único lugar.
 */

// Objeto de mensajes de traducción por defecto para las pruebas.
// Esto evita que las pruebas fallen por falta de traducciones.
// Cada prueba puede sobreescribir o extender estos mensajes si es necesario.
const defaultMessages = {
  Errors: {
    unexpected: "An unexpected test error occurred.",
    validation: "A test validation error occurred: {details}",
  },
};

/**
 * Componente Wrapper que provee todos los contextos necesarios para las pruebas.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - El componente o hook a ser renderizado.
 * @returns {React.ReactElement} El componente envuelto en los proveedores.
 */
const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NextIntlClientProvider
      locale="en"
      messages={defaultMessages}
      timeZone="Etc/UTC"
    >
      {children}
    </NextIntlClientProvider>
  );
};

/**
 * Función `render` personalizada que utiliza el wrapper `AllTheProviders`.
 * @param {ReactElement} ui - El elemento de React a renderizar.
 * @param {Omit<RenderOptions, 'wrapper'>} [options] - Opciones de renderizado de RTL.
 * @returns {import('@testing-library/react').RenderResult} El resultado del renderizado.
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Función `renderHook` personalizada que utiliza el wrapper `AllTheProviders`.
 * @template TProps - Tipo de las props del hook.
 * @template TResult - Tipo del resultado del hook.
 * @param {(initialProps: TProps) => TResult} renderCallback - La función que llama al hook.
 * @param {Omit<RenderHookOptions<TProps>, 'wrapper'>} [options] - Opciones de renderizado de RTL.
 * @returns {import('@testing-library/react').RenderHookResult<TResult, TProps>} El resultado del renderizado del hook.
 */
const customRenderHook = <TResult, TProps>(
  renderCallback: (initialProps: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, "wrapper">
) => renderHook(renderCallback, { wrapper: AllTheProviders, ...options });

// Re-exportar todo desde react-testing-library
export * from "@testing-library/react";

// Sobreescribir `render` y `renderHook` con nuestras versiones personalizadas
export { customRender as render, customRenderHook as renderHook };

/**
 * ##################################################################################
 * # CÓDIGO LEGADO                                                                  #
 * ##################################################################################
 *
 * Mejoras implementadas:
 *
 * ((Implementada)) Proveedor de Internacionalización Integrado: El arnés ahora
 *   envuelve automáticamente todo en `NextIntlClientProvider`, haciendo que las
 *   pruebas de componentes con traducciones sean fluidas y consistentes.
 * ((Implementada)) Arnés Completo (render y renderHook): Se proporciona un
 *   `renderHook` personalizado, asegurando que los hooks se prueben en el mismo
 *   entorno de contexto que los componentes, eliminando inconsistencias.
 * ((Implementada)) Centralización de Imports (DX): Al re-exportar todo desde
 *   `@testing-library/react`, se simplifica el desarrollo. Los archivos de prueba
 *   ahora importan todo lo necesario (screen, fireEvent, etc.) desde un
 *   único lugar: `@/lib/testing/harness`.
 *
 * ##################################################################################
 * # MEJORA CONTINUA                                                                #
 * ##################################################################################
 *
 * Melhorias Futuras:
 *
 * ((Vente)) Proveedor de Tema (Theming): Si el proyecto adopta una librería de
 *   theming (ej. Styled Components, Tailwind Theme Provider), el proveedor
 *   correspondiente debe ser añadido a `AllTheProviders`.
 * ((Vigente)) Proveedor de Router Mockeado: Para pruebas de integración más
 *   complejas que requieran simular cambios de ruta y estado del router, se
 *   puede integrar un proveedor de router en memoria (Memory Router).
 *
 */
// src/lib/testing/harness.tsx
