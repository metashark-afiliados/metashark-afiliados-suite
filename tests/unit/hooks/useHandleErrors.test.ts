// tests/unit/hooks/useHandleErrors.test.ts
/**
 * @file tests/unit/hooks/useHandleErrors.test.ts
 * @description Arnés de pruebas unitarias de élite para el hook `useHandleErrors`.
 *              Ha sido refactorizado para consumir la infraestructura de mocks global,
 *              resolviendo fallos de prueba sistémicos y alineándose con la
 *              arquitectura de simulación canónica.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import toast from "react-hot-toast";
import { ZodError, type ZodIssue } from "zod";
import { act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { createPersistentErrorLog } from "@/lib/actions/_helpers/error-log.helper";
import { useHandleErrors } from "@/lib/hooks/useHandleErrors";
import { renderHook } from "@tests/utils/render";

// La librería 'react-hot-toast' es simulada globalmente en tests/mocks/index.ts
// Esta importación será interceptada por Vitest, que nos proveerá el spy.
vi.mock("react-hot-toast");
vi.mock("@/lib/actions/_helpers/error-log.helper");

describe("Hook: useHandleErrors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe manejar un ZodError, mostrar un mensaje localizado y registrar el error", async () => {
    const { result } = renderHook(() => useHandleErrors());
    const mockIssues: ZodIssue[] = [
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["name"],
        message: "name_required",
      },
    ];
    const zodError = new ZodError(mockIssues);
    const expectedToastMessage = "El nombre es requerido.";

    await act(async () => {
      await result.current.handleError(zodError);
    });

    expect(toast.error).toHaveBeenCalledWith(expectedToastMessage);
    expect(createPersistentErrorLog).toHaveBeenCalledWith(
      "useHandleErrors",
      expect.any(ZodError),
      expect.any(Object)
    );
  });

  it("debe manejar un Error estándar, mostrar su mensaje y registrar el error", async () => {
    const { result } = renderHook(() => useHandleErrors());
    const specificMessage = "Database connection failed";
    const standardError = new Error(specificMessage);

    await act(async () => {
      await result.current.handleError(standardError);
    });

    expect(toast.error).toHaveBeenCalledWith(specificMessage);
    expect(createPersistentErrorLog).toHaveBeenCalledWith(
      "useHandleErrors",
      standardError,
      expect.any(Object)
    );
  });

  it("debe manejar un error de tipo string, mostrar un mensaje genérico y registrar el error", async () => {
    const { result } = renderHook(() => useHandleErrors());
    const stringError = "Something went wrong as a string";
    const expectedToastMessage =
      "Ocurrió un error en el servidor. Por favor, inténtalo de nuevo.";

    await act(async () => {
      await result.current.handleError(stringError);
    });

    expect(toast.error).toHaveBeenCalledWith(expectedToastMessage);
    expect(createPersistentErrorLog).toHaveBeenCalledWith(
      "useHandleErrors",
      expect.any(Error),
      expect.objectContaining({ error: stringError })
    );
  });

  it("debe manejar un error de tipo objeto, mostrar un mensaje genérico y registrar el error", async () => {
    const { result } = renderHook(() => useHandleErrors());
    const objectError = { code: 500, reason: "Internal Server Error" };
    const expectedToastMessage =
      "Ocurrió un error en el servidor. Por favor, inténtalo de nuevo.";

    await act(async () => {
      await result.current.handleError(objectError);
    });

    expect(toast.error).toHaveBeenCalledWith(expectedToastMessage);
    expect(createPersistentErrorLog).toHaveBeenCalledWith(
      "useHandleErrors",
      expect.any(Error),
      expect.objectContaining({ error: JSON.stringify(objectError, null, 2) })
    );
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Falla Sistémica**: ((Implementada)) Se ha refactorizado la importación para consumir `react-hot-toast` directamente. Esta corrección, junto con la refactorización de `tests/mocks/index.ts`, resuelve la causa raíz de las fallas de prueba.
 * 2. **Aserciones de Alta Fidelidad**: ((Implementada)) Las aserciones ahora validan que los mensajes de `toast` sean las traducciones reales, gracias a la integración con el `ProvidersWrapper` del arnés de renderizado.
 * 3. **Pruebas Asíncronas Robustas**: ((Implementada)) Se utiliza `async/await` con `act` para asegurar que todas las promesas dentro del hook se resuelvan antes de realizar las aserciones, previniendo falsos negativos.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Contexto**: ((Vigente)) Inyectar un `DashboardContext` mockeado a través de `renderHook` para verificar que el hook puede extraer y pasar el `userId` a `createPersistentErrorLog`.
 *
 * =====================================================================
 */
// tests/unit/hooks/useHandleErrors.test.ts
