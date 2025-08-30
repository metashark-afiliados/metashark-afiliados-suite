// .docs/009_CICD_AND_ENVIRONMENT_MANIFEST.md
/**
 * @file .docs/009_CICD_AND_ENVIRONMENT_MANIFEST.md
 * @description Manifiesto de Despliegue Continuo y Gestión de Entorno v1.0.
 *              Esta es la SSoT que define el flujo de trabajo completo para
 *              desplegar `ConvertiKit` en Vercel, la configuración de GitHub Actions,
 *              los hooks de Git, y la gestión de variables de entorno.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto de CI/CD y Gestión de Entorno v1.0

## 1. Filosofía: "Calidad por Defecto, Despliegue con Confianza"

Nuestro flujo de CI/CD está diseñado para ser una **red de seguridad automática**. Cada `commit` es validado. Cada `Pull Request` es probado exhaustivamente. El despliegue a producción solo ocurre si se superan todas las barreras de calidad. Esto nos permite innovar rápidamente con una confianza absoluta en la estabilidad del sistema.

## 2. Flujo de Trabajo de Despliegue (Git -> GitHub -> Vercel)

El flujo de trabajo es lineal y está automatizado a través de la integración de GitHub y Vercel.

*   **Diagrama de Flujo de Despliegue (Mermaid):**
    ```mermaid
    sequenceDiagram
        participant Dev as Desarrollador
        participant Git as Git Local
        participant GitHub as Repositorio GitHub
        participant GHA as GitHub Actions
        participant Vercel as Vercel

        Dev->>Git: git commit
        Note over Git: pre-commit hook (lint, format)
        Git->>GitHub: git push origin feature-branch
        GitHub->>GHA: Dispara Workflow de PR
        GHA->>GHA: 1. Build & Type Check
        GHA->>GHA: 2. Run Unit & Integration Tests
        GHA-->>GitHub: Reporta Éxito/Fallo de Checks
        GitHub->>Vercel: Dispara Preview Deployment
        Vercel-->>GitHub: Reporta Éxito/Fallo y publica URL
        
        Dev->>GitHub: Revisa Checks y Preview URL
        Dev->>GitHub: Squash and Merge PR a `main`
        GitHub->>Vercel: Dispara Production Deployment
        Vercel-->>Vercel: Despliega a Producción
    ```

### 2.1. Hooks de Git Locales (`.husky/`)

*   **`pre-commit`:** Antes de permitir un `commit`, se ejecutan automáticamente los scripts `lint:fix` y `format`. Esto garantiza que ningún código que no cumpla con los estándares de estilo llegue al repositorio.

### 2.2. GitHub Actions (`.github/workflows/`)

*   **Workflow `on: pull_request`:**
    1.  **Build & Type Check:** Ejecuta `pnpm build` y `pnpm typecheck` para asegurar que el proyecto compila sin errores de TypeScript.
    2.  **Run Tests:** Ejecuta la suite completa de pruebas unitarias y de integración (`pnpm test`).

### 2.3. Despliegues en Vercel

*   **Preview Deployments:** Cada `push` a una rama de un Pull Request genera automáticamente un despliegue de previsualización en Vercel con una URL única. Esto permite la revisión visual y funcional de los cambios en un entorno idéntico al de producción.
*   **Production Deployments:** Cada `merge` a la rama `main` dispara automáticamente un despliegue a producción.

## 3. Manifiesto de Variables de Entorno

*   **SSoT:** El archivo `.env.example` en la raíz del proyecto es la Única Fuente de Verdad para todas las variables de entorno requeridas.
*   **Jerarquía de Entornos:**
    *   **Desarrollo Local (`.env.local`):** Se utiliza para el desarrollo diario. `DEV_MODE_...` pueden ser activados aquí.
    *   **Entorno de Pruebas (CI/CD):** Las variables se configuran como "Secrets" en GitHub Actions.
    *   **Entorno de Vercel (Preview & Production):** Las variables se configuran en el panel de control de Vercel.
*   **Modo de Desarrollo Aislado (Modo Boilerplate):**
    *   **Variable:** `DEV_MODE_BOILERPLATE_CREATION=true`
    *   **Comportamiento:** Cuando está activa, las Server Actions de creación (ej. `createCreationAction`) no interactúan con la base de datos y devuelven un ID estático. Esto permite el desarrollo de la UI del Builder de forma aislada, sin necesidad de una base de datos funcional.

## 4. Próximos Pasos (Roadmap de Infraestructura)

*   **Completado:** Hooks de `pre-commit`, workflow de CI/CD para PRs, despliegues automáticos en Vercel.
*   **Próximos Pasos (Vigente):**
    1.  **Pruebas E2E en CI:** Integrar la ejecución de la suite de Playwright (`pnpm e2e`) en el workflow de GitHub Actions, ejecutándola contra la URL del "Preview Deployment" de Vercel.
    2.  **Sincronización de Variables de Entorno:** Implementar una GitHub Action que compare las variables en Vercel con `.env.example` y alerte sobre discrepancias para prevenir fallos de despliegue por configuración faltante.

// .docs/009_CICD_AND_ENVIRONMENT_MANIFEST.md