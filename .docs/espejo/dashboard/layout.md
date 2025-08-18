// .docs/espejo/dashboard/layout.md
/**
 * @file .docs/espejo/dashboard/layout.md
 * @description Blueprint Arquitectónico de Élite para el `DashboardLayout` v9.1.
 *              Este documento define la nueva arquitectura de layout del "Workspace Creativo".
 * @author Raz Podestá
 * @version 9.1.0
 */
# Blueprint: `src/app/[locale]/dashboard/layout.tsx` - El Orquestador de Layout

#### **[Tipo de Aparato]**
Orquestador de Layout de Servidor (Server Component).

#### **[Filosofía de Diseño y Propósito]**
La misión del `DashboardLayout` v9.1 es establecer una **estructura de interfaz persistente y de alta productividad**, inspirada en los líderes de la industria (Canva, CapCut). Su filosofía es "Contexto Constante, Contenido Fluido".

Abandona el layout simple anterior para adoptar una arquitectura de **Header Fijo + Sidebar Izquierda + Área de Contenido Principal**. Esta estructura proporciona al usuario un anclaje de navegación y contexto constante, mientras permite que el área de trabajo principal se adapte dinámicamente.

#### **[Análisis del Estado Anterior (Deuda Técnica)]**
El layout anterior (v5.1.0) utilizaba un `DashboardHeader` global que contenía el `WorkspaceSwitcher` y una `Sidebar` puramente navegacional. Esta estructura carecía de la jerarquía y el flujo de trabajo de una aplicación creativa moderna.

#### **[Arquitectura Propuesta (El Estado de Élite)]**
El componente implementará una estructura de `div` con CSS Grid o Flexbox para crear tres zonas visuales distintas:

1.  **`DashboardSidebar` (Izquierda):** Renderizado directamente. Será persistente y visible en vistas de escritorio.
2.  **Zona Principal (Derecha):** Un `div` que contendrá tanto el `DashboardHeader` como el `{children}`.
3.  **`DashboardHeader` (Superior-Derecha):** Renderizado dentro de la zona principal. Será `sticky` para permanecer visible en el scroll.
4.  **`main` (Contenido):** Renderizará el `{children}` (la página actual).
5.  **`DashboardProvider`:** Seguirá envolviendo toda la estructura, obteniendo los datos de sesión y pasándolos vía contexto.

**Diagrama de Flujo (Mermaid):**
```mermaid
graph TD
    A[getLayoutData()] -- Datos de Sesión --> B{DashboardProvider};
    B --> C[div.flex.min-h-screen];
    C --> D(DashboardSidebar);
    C --> E[div.flex.flex-col];
    E --> F(DashboardHeader);
    E --> G[main.p-4];
    G --> H{children};