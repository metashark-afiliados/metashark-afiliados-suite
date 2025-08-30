// .docs/008_TESTING_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/008_TESTING_ARCHITECTURE_MANIFEST.md
 * @description Manifiesto Canónico de Arquitectura de Pruebas v1.0.
 *              Esta es la SSoT que define la filosofía, la infraestructura,
 *              los patrones y los estándares para todas las pruebas en ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Arquitectura de Pruebas v1.0

## 1. Filosofía: "Confianza a través de la Verificación Atómica y Aislada"

Nuestra estrategia de pruebas se basa en la pirámide de pruebas. Priorizamos las pruebas unitarias rápidas y aisladas, complementadas por pruebas de integración de mayor fidelidad y cubiertas por una capa final de pruebas E2E que validan los flujos críticos del usuario. El objetivo no es solo la cobertura de código, sino la **confianza en que cada refactorización no introduce regresiones**.

## 2. Configuración e Infraestructura

*   **SSoT de Configuración:** `vitest.config.ts` (base), `*.unit.ts`, `*.integration.ts`, `playwright.config.ts`.
*   **Aislamiento de Suites:**
    *   **Pruebas Unitarias (`tests/unit`):** Verifican un único aparato (componente, hook, helper) de forma aislada. Son rápidas y deben ejecutarse en cada cambio.
    *   **Pruebas de Integración (`tests/integration`):** Verifican la interacción entre múltiples aparatos (ej. un componente de cliente que invoca una Server Action). Pueden interactuar con un servidor de red simulado (MSW).
    *   **Pruebas End-to-End (`tests/e2e`):** Verifican flujos de usuario completos en un navegador real (`Playwright`).
*   **Estrategia de Mocks de Calidad:**
    *   **SSoT de Mocks:** `tests/mocks/index.ts` orquesta todos los mocks globales.
    *   **Mocks de Módulo (`vi.mock`):** Se utilizan para aislar aparatos de sus dependencias (`Supabase`, `next-intl`, `actions`).
    *   **Mocks de Red (`MSW`):** Se utiliza `msw` para interceptar y simular peticiones de red a APIs externas, pero se define a nivel de prueba (`server.use(...)`) para máxima claridad y aislamiento.

## 3. Patrones de Implementación de Pruebas

### 3.1. La Ruta Espejo

*   **Directiva:** La estructura de directorios dentro de `tests/unit` y `tests/integration` **DEBE** ser un espejo de la estructura de `src/`.
*   **Ejemplo:** La prueba para `src/lib/hooks/useSitesPage.ts` debe residir en `tests/unit/lib/hooks/useSitesPage.test.ts`.
*   **Justificación:** Facilita la localización de pruebas, promueve la cobertura completa y mantiene el proyecto organizado a medida que escala.

### 3.2. Arnés de Renderizado Centralizado (`render`)

*   **SSoT Técnica:** `tests/utils/render.tsx`.
*   **Funcionalidad:** Proporciona funciones `render` y `renderHook` personalizadas que envuelven automáticamente los componentes en todos los proveedores de contexto necesarios (`DashboardProvider`, `NextIntlClientProvider`, etc.), inyectando datos simulados de alta fidelidad desde factorías (`@faker-js/faker`).
*   **Justificación:** Adhesión estricta al principio DRY. Las pruebas se escriben de forma más limpia y son más resistentes a cambios en la estructura de proveedores.

### 3.3. Principios DRY y SOLID en Pruebas

*   **DRY:** Se deben crear factorías de datos (`context.factory.ts`) y helpers de interacción (`auth.spec.ts`) para abstraer la lógica de configuración y las secuencias de acciones repetitivas.
*   **SRP:** Cada prueba (`it(...)`) debe verificar una única condición o comportamiento.

## 4. Sistema de Aprobación de Pruebas

*   **Directiva:** No se guardan los archivos de prueba (`.test.tsx`) en el control de versiones a largo plazo para mantener el repositorio limpio y ligero. En su lugar, el **código fuente** que ha sido probado es el que recibe la marca de aprobación.
*   **Implementación:** Se utilizará el bloque de comentarios "ESTADO DEL APARATO" en cada archivo de `src/`.
    ```typescript
    /**
     * =====================================================================
     * @status APROBADO
     * =====================================================================
     */
    ```
*   **Flujo de Trabajo:**
    1.  Se escribe un arnés de prueba para un aparato.
    2.  Se ejecutan las pruebas (`pnpm test:unit`, etc.).
    3.  Una vez que todas las pruebas para ese aparato pasan, se actualiza el bloque de estado en el **archivo de código fuente** a `APROBADO ✅`, se referencia la ruta del arnés de prueba y se versiona.
    4.  El archivo de prueba puede ser descartado antes del `commit` final. El bloque de estado sirve como **prueba inmutable** de que la verificación fue completada.

// .docs/008_TESTING_ARCHITECTURE_MANIFEST.md