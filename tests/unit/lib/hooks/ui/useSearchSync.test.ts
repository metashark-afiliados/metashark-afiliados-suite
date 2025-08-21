// tests/unit/lib/hooks/ui/useSearchSync.test.ts
/**
 * @file useSearchSync.test.ts
 * @description Arnés de pruebas de alta calidad para el hook `useSearchSync`.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSearchSync } from "@/lib/hooks/ui/useSearchSync";
import { routerMock } from "@tests/mocks/vi/navigation.mock";

// Mock del hook useDebounce para tener control sobre su ejecución en las pruebas
vi.mock("@/lib/hooks/use-debounce", () => ({
  useDebounce: (value: any) => value,
}));

describe("Hook Atómico de UI: useSearchSync", () => {
  it("debe inicializar con el searchQuery proporcionado", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useSearchSync({ initialQuery: "test-inicial" })
    );

    // Assert
    expect(result.current.searchTerm).toBe("test-inicial");
  });

  it("debe actualizar el searchTerm inmediatamente", () => {
    // Arrange
    const { result } = renderHook(() => useSearchSync());

    // Act
    act(() => {
      result.current.setSearchTerm("nuevo-valor");
    });

    // Assert
    expect(result.current.searchTerm).toBe("nuevo-valor");
  });

  it("debe actualizar la URL con el término de búsqueda después del debounce", async () => {
    // Arrange
    const { result } = renderHook(() => useSearchSync());

    // Act
    act(() => {
      result.current.setSearchTerm("busqueda");
    });

    // Assert
    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith(
        "/mock-pathname?q=busqueda",
        { scroll: false }
      );
    });
  });

  it("debe resetear la paginación a la página 1 cuando se realiza una nueva búsqueda", async () => {
    // Arrange
    // Simula una URL que ya tiene paginación
    routerMock.setCurrentUrl("/mock-pathname?page=3");
    const { result } = renderHook(() => useSearchSync());

    // Act
    act(() => {
      result.current.setSearchTerm("nueva-busqueda");
    });

    // Assert
    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith(
        "/mock-pathname?page=1&q=nueva-busqueda",
        { scroll: false }
      );
    });
  });

  it("debe eliminar el parámetro de búsqueda de la URL si el término es vacío", async () => {
    // Arrange
    routerMock.setCurrentUrl("/mock-pathname?q=valor-anterior");
    const { result } = renderHook(() =>
      useSearchSync({ initialQuery: "valor-anterior" })
    );

    // Act
    act(() => {
      result.current.setSearchTerm("");
    });

    // Assert
    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith("/mock-pathname?", {
        scroll: false,
      });
    });
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Pruebas de Alta Fidelidad**: ((Implementada)) El arnés utiliza `renderHook` y simula el `router` para validar el comportamiento del hook en un entorno que replica fielmente su uso real.
 * 2. **Cobertura Completa**: ((Implementada)) Se validan todos los casos de uso críticos: inicialización, actualización de estado, sincronización de URL, reseteo de paginación y limpieza de parámetros.
 * 3. **Control sobre Dependencias**: ((Implementada)) Se simula `useDebounce` para eliminar la variable de tiempo del arnés de pruebas, haciéndolo más rápido y determinista.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de `isSyncing`**: ((Vigente)) Añadir una prueba que valide que el flag `isSyncing` se establece correctamente en `true` durante la transición de la actualización de la URL.
 *
 * =====================================================================
 */
// tests/unit/lib/hooks/ui/useSearchSync.test.ts
