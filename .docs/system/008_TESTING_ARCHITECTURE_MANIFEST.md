// .docs/system/008_TESTING_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/system/008_TESTING_ARCHITECTURE_MANIFEST.md
 * @description Manifiesto Canónico de Arquitectura de Pruebas v1.0.
 *              Esta es la SSoT que define la filosofía, infraestructura y
 *              patrones para todas las pruebas en ConvertiKit. Expande la
 *              capa de Verificación del Sistema Espejo y reemplaza a
 *              `.docs/008_TESTING_ARCHITECTURE_MANIFEST.md`.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Arquitectura de Pruebas v1.0

## 1. Filosofía: "Confianza a través de la Verificación Atómica y Aislada"
*   **Referencia a la Constitución:** AD-001.
*   Nuestra estrategia se basa en la pirámide de pruebas. Priorizamos las pruebas unitarias rápidas y aisladas, complementadas por pruebas de integración y cubiertas por una capa final de pruebas E2E. El objetivo es la **confianza en la no regresión**.

## 2. Configuración e Infraestructura
*   **SSoT de Configuración:** `vitest.config.ts`, `playwright.config.ts`.
*   **Aislamiento de Suites:**
    *   **Unitarias (`tests/unit`):** Verifican un único aparato de forma aislada.
    *   **Integración (`tests/integration`):** Verifican la interacción entre múltiples aparatos, pudiendo usar un servidor de red simulado (MSW).
    *   **End-to-End (`tests/e2e`):** Verifican flujos de usuario completos en un navegador real (`Playwright`).
*   **Estrategia de Mocks:**
    *   **SSoT de Mocks:** `tests/mocks/index.ts` orquesta todos los mocks globales.
    *   **Mocks de Módulo (`vi.mock`):** Se utilizan para aislar aparatos de sus dependencias.
    *   **Mocks de Red (`MSW`):** Se definen a nivel de prueba (`server.use(...)`) para máxima claridad y aislamiento.

## 3. Patrones de Implementación de Pruebas

### 3.1. La Ruta Espejo
*   **Directiva:** La estructura de directorios dentro de `tests/unit` y `tests/integration` **DEBE** ser un espejo de la estructura de `src/`.
*   **Justificación:** Facilita la localización de pruebas y promueve la cobertura completa.

### 3.2. Arnés de Renderizado Centralizado (`render`)
*   **SSoT Técnica:** `tests/utils/render.tsx`.
*   **Funcionalidad:** Proporciona funciones `render` y `renderHook` personalizadas que envuelven automáticamente los componentes en todos los proveedores de contexto necesarios (`DashboardProvider`, `NextIntlClientProvider`), inyectando datos simulados de alta fidelidad.
*   **Justificación:** Adhesión estricta al principio DRY.

## 4. Sistema de Aprobación de Pruebas
*   **Directiva:** El **código fuente** que ha sido probado es el que recibe la marca de aprobación.
*   **Implementación:** Se utiliza el bloque de comentarios "ESTADO DEL APARATO" en cada archivo de `src/`.
    ```typescript
    /**
     * =====================================================================
     * @status APROBADO ✅
     * @harness tests/unit/ruta/al/aparato.test.tsx
     * @version 1.0.0
     * =====================================================================
     */
    ```
*   **Flujo de Trabajo:** Una vez que todas las pruebas para un aparato pasan, se actualiza el bloque de estado en el **archivo de código fuente** y se versiona.
// .docs/system/008_TESTING_ARCHITECTURE_MANIFEST.md