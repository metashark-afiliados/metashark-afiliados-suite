// tests/mocks/factories/navigation.mock.ts
/**
 * @file tests/mocks/factories/navigation.mock.ts
 * @description Factoría de mock atómica para la navegación.
 *              Esta es la Única Fuente de Verdad para simular el enrutador de Next.js
 *              y nuestro wrapper personalizado (`@/lib/navigation`). Utiliza `next-router-mock`
 *              para una simulación de alta fidelidad, eliminando la necesidad de mocks
 *              manuales y frágiles.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { vi } from "vitest";

/**
 * @public
 * @function setupNavigationMock
 * @description Configura `vi.mock` para interceptar las importaciones de `next/navigation`
 *              y `@/lib/navigation`. Redirige la lógica de enrutamiento al simulador
 *              `next-router-mock`, permitiendo que los componentes que usan `useRouter`,
 *              `usePathname` o `<Link>` funcionen correctamente en un entorno de prueba.
 */
export const setupNavigationMock = () => {
  // Redirige TODAS las llamadas a 'next/navigation' a la librería de mock.
  vi.mock("next/navigation", () => require("next-router-mock"));

  // Simula nuestro wrapper de navegación para que use los mocks subyacentes.
  vi.mock("@/lib/navigation", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/navigation")>();
    const nextRouterMock = await import("next-router-mock");
    const NextLink = (await import("next/link")).default;

    return {
      ...actual,
      useRouter: nextRouterMock.useRouter,
      usePathname: vi.fn(() => "/mock-pathname"), // Devuelve un valor estático para consistencia
      Link: NextLink, // Usa el componente Link real, que es interceptado por el mock global
      redirect: vi.fn((path: string) => {
        console.log(`[MOCK] Redirecting to: ${path}`);
      }),
    };
  });
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. **Simulación de Alta Fidelidad**: ((Implementada)) Al delegar la simulación a `next-router-mock`, aseguramos una compatibilidad y comportamiento consistentes con el enrutador real de Next.js.
 * 2. **Atomicidad y Cohesión**: ((Implementada)) La lógica de mock para la navegación está ahora completamente aislada en su propio módulo, mejorando la organización y el SRP.
 *
 * @subsection Melhorias Futuras
 * 1. **Pathname Dinámico**: ((Vigente)) El mock de `usePathname` podría ser mejorado para que las pruebas puedan establecer su valor de retorno dinámicamente, permitiendo simular el renderizado de componentes en diferentes rutas.
 * =====================================================================
 */
// tests/mocks/factories/navigation.mock.ts
