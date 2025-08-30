// .docs/espejo/functionality/004_BUILDER_DOMAIN_MANIFEST.md
/**
 * @file .docs/espejo/functionality/004_BUILDER_DOMAIN_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto del Dominio "Builder & Creations".
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Dominio "Builder & Creations"

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que define el propósito de negocio, la arquitectura técnica, los flujos de lógica y el roadmap de evolución para el dominio `Builder & Creations`. Sirve como la guía de referencia funcional de alto nivel para el corazón creativo de ConvertiKit.

## 2. Arquitectura del Contenido
El manifiesto se estructura para proporcionar una visión 360° del dominio:
1.  **Rol Estratégico:** Define la filosofía de "Diseño Soberano y Experiencia de Usuario Resiliente".
2.  **Funcionalidades Implementadas:** Detalla las capacidades actuales del Builder, incluyendo la gestión de estado de élite con Zustand y el sistema de bloques.
3.  **Arquitectura Técnica y de Datos:** Explica el modelo de base de datos para `creations` y la arquitectura de estado con Zustand.
4.  **Flujos de Lógica de Negocio:** Documenta los flujos críticos de carga, hidratación y guardado.
5.  **Roadmap de Evolución:** Especifica las funcionalidades completadas y las próximas a implementar.

## 3. Contrato de API
- **Formato de Entrada:** Requerimientos de negocio y decisiones arquitectónicas de la Constitución (AD-003).
- **Formato de Salida:** Documento Markdown que sirve como la SSoT funcional para el dominio del Builder.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Implementación del "Arsenal de Conversión":** Crear todos los componentes de bloque (`Header1`, `Hero1`, `Features1`, etc.) y sus manifiestos de edición (`*.definition.ts`).
 * 2.  **Activación del `SettingsPanel`:** Implementar todos los tipos de campo de configuración (`ArrayField`, `IconField`, etc.).
 * 3.  **Galería de Plantillas:** Implementar la UI y la lógica para que los usuarios puedan añadir bloques pre-diseñados desde una galería.
 * 4.  **Implementación del Autoguardado:** Crear e integrar el hook `useAutoSync`.
 * 5.  **Integración de `Brand Kits`:** Conectar el `themeSlice` del store con la tabla `brand_kits`.
 * 6.  **Edición Colaborativa en Tiempo Real:** Implementar un sistema (ej. usando Supabase Realtime y CRDTs) que permita a múltiples usuarios editar la misma `Creation` simultáneamente.
 * 7.  **Historial de Versiones:** Guardar snapshots del `content` de la `Creation` para permitir a los usuarios revertir a versiones anteriores.
 * 8.  **Modo de Comentarios:** Añadir una capa sobre el Canvas que permita a los miembros del equipo dejar comentarios en bloques específicos.
 * 9.  **Análisis de Rendimiento de Bloques (A/B Testing):** Integrar con la capa de analíticas para mostrar qué variantes de un bloque (ej. diferentes `Hero1`) convierten mejor.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/functionality/004_BUILDER_DOMAIN_MANIFEST.md```

#### **2. Aparato de Código (Nuevo Manifiesto Consolidado)**

```markdown
// .docs/functionality/004_BUILDER_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/004_BUILDER_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Builder & Creations" v1.0.
 *              Esta es la SSoT que define la arquitectura y lógica para el
 *              constructor visual. Reemplaza a la versión anterior.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
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