// .docs/functionality/004_BUILDER_CREATIONS_MANIFEST.md
/**
 * @file .docs/functionality/004_BUILDER_CREATIONS_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Builder & Creations" v1.0.
 *              Esta es la SSoT que define el propósito, la arquitectura y la
 *              lógica de negocio para el constructor visual de ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Builder & Creations"

## 1. Rol Estratégico y Propósito de Negocio

El dominio `Builder & Creations` es el **corazón creativo y de creación de valor** de `ConvertiKit`. Su propósito es empoderar a los usuarios para que construyan activos de marketing de alta conversión (`Creations`) de forma visual e intuitiva, sin necesidad de escribir código.

*   **Filosofía:** "Diseño Soberano y Experiencia de Usuario Resiliente".
    *   **Diseño Soberano:** La `Creation` es el blueprint de diseño puro (la estructura y estilo), completamente agnóstica de dónde será publicada. La `Campaign` es la instancia publicada de una `Creation` en un `Site` específico.
    *   **UX Resiliente:** El trabajo del usuario es la máxima prioridad. La arquitectura `Hyper-Resilient Smart Client` garantiza que el estado nunca se pierda.

## 2. Funcionalidades Implementadas

*   **Creación de Diseños:** Los usuarios pueden iniciar una nueva `Creation` desde el `ActionDock` del dashboard.
*   **Infraestructura del Builder:** El layout principal del constructor está completo, incluyendo el `BuilderHeader` (con controles de vista de dispositivo y estado de guardado), la `PrimaryToolBar` (navegación de herramientas), el `Canvas` (área de renderizado) y el `SettingsPanel`.

*   **Gestión de Estado de Élite (Zustand):**
    *   **Estado Centralizado:** Un store de Zustand gestiona el `campaignConfig` (la estructura de la `Creation` activa).
    *   **Undo/Redo:** El middleware `zundo` proporciona un historial de cambios ilimitado.
    *   **Persistencia Local:** El middleware `persist` guarda automáticamente el estado en `localStorage`, previniendo la pérdida de datos.
    *   **Sincronización Multi-Pestaña:** El middleware `syncTabs` mantiene el estado coherente si el usuario abre el mismo builder en múltiples pestañas.
*   **Sistema de Bloques:**
    *   **Renderizado Dinámico:** El `Canvas` puede renderizar dinámicamente cualquier bloque registrado en `blockRegistry`.
    *   **Edición en Vivo:** Los componentes de bloque utilizan `EditableText` para permitir la edición de contenido directamente en el `Canvas`.
*   **Drag and Drop:** La infraestructura de `dnd-kit` está implementada, permitiendo reordenar bloques dentro del `Canvas`.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Entidad-Relación (Base de Datos)

*   **SSoT de Datos:** Tabla `creations`.
*   **Diagrama de Entidad-Relación (Mermaid):**
    ```mermaid
    erDiagram
        profiles   ||--|{ creations : "crea"
        workspaces ||--|{ creations : "contiene"
        creations  ||--o{ campaigns : "es instanciada como"
    ```
*   **Descripción:** Una `Creation` es propiedad de un `profile` y pertenece a un `workspace`. Una única `Creation` puede ser instanciada en múltiples `Campaigns` (arquitectura futura para A/B testing). El contenido del diseño se almacena en la columna `content` (JSONB).

### 3.2. Arquitectura de Estado (Zustand)

*   **SSoT de Estado:** `src/lib/builder/core/store.factory.ts`.
*   **Diagrama de Flujo de Estado:**
    ```mermaid
    graph TD
        subgraph "UI (Builder)"
            A[Canvas / SettingsPanel] <-->|Lee/Escribe| B((Zustand Store));
        end
        subgraph "Middlewares"
            B <--> C[temporal (Undo/Redo)];
            B <--> D[persist (localStorage)];
            B <--> E[syncTabs];
        end
    ```

## 4. Flujos de Lógica de Negocio

*   **SSoT de Lógica de Negocio:** `src/lib/actions/creations/`.
*   **Flujos Críticos:**
    1.  **Carga e Hidratación del Builder:**
        *   **Trigger:** Usuario navega a `/builder/[creationId]`.
        *   **Lógica:** El Server Component `page.tsx` obtiene la `Creation` de la base de datos. Pasa el `content` como `initialState` al `BuilderStoreProvider`, que hidrata el store de Zustand en el cliente.
    2.  **Guardado de Cambios (`updateCreationContentAction`):**
        *   **Trigger:** Usuario hace clic en "Guardar" en el `BuilderHeader`.
        *   **Lógica:**
            1.  El hook `useBuilderHeader` obtiene el estado actual completo del `campaignConfig` desde el store de Zustand.
            2.  Invoca la `Server Action`, pasándole el `creationId` y el `content`.
            3.  La acción valida que el usuario sea el `created_by` de la `Creation`.
            4.  Actualiza la fila en la tabla `creations`.
            5.  Al recibir una respuesta exitosa, el hook `useBuilderHeader` limpia el historial de `zundo`, marcando el estado como "limpio" (`isDirty = false`).

## 5. Roadmap de Evolución del Dominio

*   **Completado:** Infraestructura de layout, sistema de estado de élite con persistencia y historial, renderizado dinámico de bloques, D&D y edición de texto en vivo.
*   **Próximos Pasos (Vigente):**
    1.  **Implementación del "Arsenal de Conversión":** Crear todos los componentes de bloque (`Header1`, `Hero1`, `Features1`, etc.) y sus manifiestos de edición (`*.definition.ts`).
    2.  **Activación del `SettingsPanel`:** Implementar todos los tipos de campo de configuración (`ArrayField`, `IconField`, etc.) para permitir la edición completa de las `props` y `styles` de los bloques.
    3.  **Galería de Plantillas:** Implementar la UI y la lógica para que los usuarios puedan añadir bloques pre-diseñados desde una galería (`TemplateGalleryModal`).
    4.  **Implementación del Autoguardado:** Crear e integrar el hook `useAutoSync` para habilitar la sincronización automática.
    5.  **Integración de `Brand Kits`:** Conectar el `themeSlice` del store con la tabla `brand_kits` para permitir la aplicación de temas dinámicos.

// .docs/functionality/004_BUILDER_CREATIONS_MANIFEST.md