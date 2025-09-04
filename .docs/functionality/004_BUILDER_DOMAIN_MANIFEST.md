// .docs/functionality/004_BUILDER_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/004_BUILDER_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Builder & Creations" v1.0.
 *              Esta es la SSoT que define la arquitectura y lógica para el
 *              constructor visual. Reemplaza a la versión anterior.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Builder & Creations"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-003, AD-005.
*   El dominio `Builder & Creations` es el **corazón creativo** de ConvertiKit. Su propósito es empoderar a los usuarios para que construyan activos de marketing (`Creations`) de forma visual e intuitiva.
*   **Filosofía:** "Diseño Soberano y Experiencia de Usuario Resiliente".

## 2. Funcionalidades Implementadas
*   **Creación de Diseños:** Los usuarios pueden iniciar una nueva `Creation` desde el `ActionDock`.
*   **Infraestructura del Builder:** Layout completo con `BuilderHeader`, `PrimaryToolBar`, `Canvas` y `SettingsPanel`.
*   **Gestión de Estado de Élite (Zustand):**
    *   **Estado Centralizado:** Un store de Zustand gestiona el `campaignConfig`.
    *   **Undo/Redo:** El middleware `zundo` proporciona un historial de cambios.
    *   **Persistencia Local:** El middleware `persist` guarda el estado en `localStorage`.
*   **Sistema de Bloques:** Renderizado dinámico y edición en vivo en el `Canvas`.
*   **Drag and Drop:** Infraestructura de `dnd-kit` para reordenar bloques.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Entidad-Relación (Base de Datos)
*   **SSoT de Datos:** Tabla `creations`.
*   **Diagrama (Mermaid):**
    ```mermaid
    erDiagram
        profiles   ||--|{ creations : "crea"
        workspaces ||--|{ creations : "contiene"
        creations  ||--o{ campaigns : "es instanciada como"
    ```
*   **Descripción:** Una `Creation` (el diseño) es propiedad de un `profile` y pertenece a un `workspace`. El contenido se almacena en la columna `content` (JSONB).

### 3.2. Arquitectura de Estado (Zustand)
*   **SSoT de Estado:** `src/lib/builder/core/store.factory.ts`.
*   **Diagrama de Flujo:**
    ```mermaid
    graph TD
        subgraph "UI (Builder)"
            A[Canvas / SettingsPanel] <-->|Lee/Escribe| B((Zustand Store));
        end
        subgraph "Middlewares"
            B <--> C[temporal (Undo/Redo)];
            B <--> D[persist (localStorage)];
        end
    ```

## 4. Flujos de Lógica de Negocio
*   **SSoT de Lógica de Negocio:** `src/lib/actions/creations/`.
*   **Flujos Críticos:**
    1.  **Carga e Hidratación:** El Server Component `page.tsx` obtiene la `Creation` y pasa el `content` como `initialState` al `BuilderStoreProvider`, que hidrata el store de Zustand.
    2.  **Guardado (`updateCreationContentAction`):** El `useBuilderHeader` obtiene el `campaignConfig` del store e invoca la `Server Action`. La acción valida la propiedad y actualiza la fila en `creations`. Al éxito, el hook limpia el historial de `zundo`.

## 5. Roadmap de Evolución del Dominio
*   **Completado:** Infraestructura de layout, sistema de estado, renderizado dinámico de bloques, D&D.
*   **Próximos Pasos (Vigente):**
    1.  Implementar el **"Arsenal de Conversión"**: Crear todos los componentes de bloque.
    2.  Activar el `SettingsPanel` con todos los tipos de campo.
    3.  Implementar la **Galería de Plantillas**.
    4.  Implementar el **Autoguardado** con el hook `useAutoSync`.
    5.  Integrar `Brand Kits` con el `themeSlice`.
// .docs/functionality/004_BUILDER_DOMAIN_MANIFEST.md