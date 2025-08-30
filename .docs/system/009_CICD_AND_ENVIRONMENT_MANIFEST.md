// .docs/system/009_CICD_AND_ENVIRONMENT_MANIFEST.md
/**
 * @file .docs/system/009_CICD_AND_ENVIRONMENT_MANIFEST.md
 * @description Manifiesto de Despliegue Continuo y Gestión de Entorno v1.0.
 *              Esta es la SSoT que define el flujo de trabajo para desplegar
 *              ConvertiKit. Reemplaza a `.docs/009_CICD_AND_ENVIRONMENT_MANIFEST.md`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto de CI/CD y Gestión de Entorno v1.0

## 1. Filosofía: "Calidad por Defecto, Despliegue con Confianza"
Nuestro flujo de CI/CD es una **red de seguridad automática**. Cada `commit` es validado. Cada `Pull Request` es probado. El despliegue a producción solo ocurre si se superan todas las barreras de calidad, permitiendo una innovación rápida con confianza absoluta en la estabilidad del sistema.

## 2. Flujo de Trabajo de Despliegue (`Git -> GitHub -> Vercel`)
El flujo de trabajo es lineal y está automatizado a través de la integración de GitHub y Vercel.

*   **Diagrama de Flujo (Mermaid):**
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
        GitHub->>GHA: Dispara Workflow de PR (Build, Tests)
        GHA-->>GitHub: Reporta Éxito/Fallo de Checks
        GitHub->>Vercel: Dispara Preview Deployment
        Vercel-->>GitHub: Reporta Éxito/Fallo y publica URL
        
        Dev->>GitHub: Revisa Checks y Preview URL, hace Merge a `main`
        GitHub->>Vercel: Dispara Production Deployment
    ```

### 2.1. Hooks de Git Locales (`.husky/`)
*   **`pre-commit`:** Antes de permitir un `commit`, se ejecutan automáticamente los scripts `lint:fix` y `format`, garantizando que ningún código que no cumpla los estándares llegue al repositorio.

### 2.2. GitHub Actions (`.github/workflows/`)
*   **Workflow `on: pull_request`:**
    1.  **Build & Type Check:** Ejecuta `pnpm build` para asegurar que el proyecto compila sin errores.
    2.  **Run Tests:** Ejecuta la suite completa de pruebas unitarias y de integración (`pnpm test`).

### 2.3. Despliegues en Vercel
*   **Preview Deployments:** Cada `push` a una rama de un Pull Request genera un despliegue de previsualización en Vercel con una URL única.
*   **Production Deployments:** Cada `merge` a la rama `main` dispara un despliegue a producción.

## 3. Manifiesto de Variables de Entorno
*   **SSoT:** El archivo `.env.example` en la raíz del proyecto es la Única Fuente de Verdad para todas las variables de entorno requeridas.
*   **Jerarquía:**
    *   **Local (`.env.local`):** Para desarrollo diario.
    *   **Pruebas (CI/CD):** Configuradas como "Secrets" en GitHub Actions.
    *   **Vercel (Preview & Production):** Configuradas en el panel de Vercel.
// .docs/system/009_CICD_AND_ENVIRONMENT_MANIFEST.md