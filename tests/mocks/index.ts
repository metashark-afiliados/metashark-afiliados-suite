// tests/mocks/index.ts
/**
 * @file tests/mocks/index.ts
 * @description Orquestador de Mocks de Módulos Definitivo v14.0.0.
 *              Ha sido purificado para eliminar el mock global de `DashboardContext`,
 *              confiando exclusivamente en la inyección explícita a través del
 *              `ProvidersWrapper` para garantizar el aislamiento y la previsibilidad de las pruebas.
 * @author Raz Podestá
 * @version 14.0.0
 */
import { vi } from "vitest";

import { setupActionsMock } from "./vi/actions.mock";
import { setupNavigationMock } from "./vi/navigation.mock";
import { setupNextIntlMock } from "./vi/next-intl.mock";
import { setupSupabaseMock } from "./vi/supabase.mock";

// --- MOCKS DE INFRAESTRUCTURA (SIN CAMBIOS) ---
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn: any) => fn,
  cache: (fn: any) => fn,
}));
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    promise: vi.fn(),
  },
}));

/**
 * @public
 * @function setupGlobalMocks
 * @description Orquesta la configuración de todos los mocks de módulo a nivel global.
 *              La simulación del `DashboardContext` ha sido eliminada deliberadamente.
 */
export const setupGlobalMocks = () => {
  setupNextIntlMock();
  setupNavigationMock();
  setupActionsMock();
  setupSupabaseMock();
  // El mock para DashboardContext ha sido deliberadamente eliminado de este orquestador.
  // La SSoT para el contexto ahora es exclusivamente `tests/utils/render.tsx`.
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aislamiento de Pruebas Garantizado**: ((Implementada)) Al eliminar el mock global, cada prueba que utilice `render` puede ahora inyectar su propio estado de contexto personalizado sin interferencias, resolviendo la causa raíz de los fallos de pruebas de contexto.
 * 2. **SSoT de Contexto Unificada**: ((Implementada)) La responsabilidad de proveer el contexto de prueba ahora reside únicamente en la utilidad `render`, creando una arquitectura de pruebas más limpia y predecible.
 *
 * @subsection Melhorias Futuras
 * 1. **Mocks Configurables**: ((Vigente)) La función `setupGlobalMocks` podría aceptar un objeto de configuración para permitir que las pruebas anulen selectivamente los mocks globales si es necesario para casos de prueba muy específicos.
 *
 * =====================================================================
 */
// tests/mocks/index.ts
