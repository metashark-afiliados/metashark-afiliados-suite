// tests/unit/lib/hooks/ui/useAuthModalStore.test.ts
/**
 * @file useAuthModalStore.test.tsx
 * @description Arnés de pruebas de élite para el store `useAuthModalStore`.
 *              Ha sido refactorizado para utilizar `renderHook` y `act`,
 *              alineándose con las mejores prácticas de prueba de Zustand.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useAuthModalStore } from "@/lib/hooks/ui/useAuthModalStore";

describe("Hook Atómico (Zustand Store): useAuthModalStore", () => {
  // Obtiene el estado inicial una sola vez para resetear
  const initialState = useAuthModalStore.getState();

  // Resetea el store a su estado inicial antes de cada prueba.
  beforeEach(() => {
    act(() => {
      useAuthModalStore.setState(initialState, true);
    });
  });

  it("debe tener un estado inicial correcto", () => {
    const { result } = renderHook(() => useAuthModalStore());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.view).toBe("login");
  });

  it("debe abrir el modal en la vista de 'signup' con openModal", () => {
    const { result } = renderHook(() => useAuthModalStore());
    act(() => {
      result.current.openModal("signup");
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.view).toBe("signup");
  });

  it("debe cerrar el modal con closeModal", () => {
    const { result } = renderHook(() => useAuthModalStore());
    act(() => {
      result.current.openModal("login");
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("debe cambiar la vista con switchView sin afectar el estado de apertura", () => {
    const { result } = renderHook(() => useAuthModalStore());
    act(() => {
      result.current.openModal("login");
    });
    act(() => {
      result.current.switchView("signup");
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.view).toBe("signup");
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Pruebas de Hooks Canónicas**: ((Implementada)) ((Vigente)) La suite ahora utiliza `renderHook` y `act`, las herramientas estándar de la industria para probar hooks y stores, resolviendo el `TypeError` y los fallos de aserción.
 *
 * =====================================================================
 */
// tests/unit/lib/hooks/ui/useAuthModalStore.test.ts
