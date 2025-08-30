// .docs/functionality/010_RESOURCE_LIBRARY_MANIFEST.md
/**
 * @file .docs/functionality/010_RESOURCE_LIBRARY_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Resource Library" v1.0.
 *              Esta es la SSoT que define el propósito y la arquitectura de la
 *              galería de iconos, una herramienta interna para desarrolladores.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Resource Library"

## 1. Rol Estratégico y Propósito de Negocio

La `Resource Library` (actualmente la Galería de Iconos) es una **herramienta interna para mejorar la Experiencia de Desarrollador (DX) y la consistencia del diseño**. Su propósito no es para el cliente final, sino para proporcionar al equipo de ingeniería y diseño un "diccionario visual" de todos los activos de UI disponibles en el proyecto.

*   **Filosofía:** "Visibilidad y Consistencia". Al proporcionar una SSoT visual y buscable de los iconos, se elimina la ambigüedad, se previene el uso de iconos inconsistentes y se acelera el proceso de desarrollo.

## 2. Funcionalidades Implementadas

*   **Visualización de Biblioteca Completa:** Renderiza todos los iconos disponibles de la librería `lucide-react` (más de 1300).
*   **Búsqueda y Filtrado en Tiempo Real:** Un campo de búsqueda permite a los desarrolladores filtrar los iconos por su nombre (en PascalCase) de forma instantánea. La búsqueda es `debounced` para un rendimiento óptimo.
*   **Copia al Portapapeles:** Al hacer clic en cualquier `IconCard`, el nombre del icono (en PascalCase) se copia automáticamente al portapapeles, listo para ser pegado en el código o en un archivo de i18n.
*   **Tooltip Informativo:** Al pasar el cursor sobre un icono, un `Tooltip` muestra su nombre en `kebab-case`, útil para otros contextos.
*   **Renderizado de Alto Rendimiento (Virtualización):** La galería utiliza `@tanstack/react-virtual` para renderizar solo las filas de iconos que están actualmente en el viewport. Esto garantiza que la página cargue instantáneamente y mantenga un scroll fluido, incluso con miles de elementos.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Datos (Basado en Ficheros)

*   **SSoT de Datos:** El manifiesto `src/config/lucide-icon-names.ts`, que es generado automáticamente por el script `pnpm gen:icons` a partir de la librería `lucide-react`. Este dominio no depende de la base de datos.

### 3.2. Arquitectura de Componentes (Frontend)

*   **SSoT de Lógica de UI:** `src/components/resources/IconGalleryClient.tsx`.
*   **Diagrama de Arquitectura (Mermaid):**
    ```mermaid
    graph TD
        A[IconGalleryClient] -- Gestiona --> B[Búsqueda (useState + useDebounce)];
        A -- Gestiona --> C[Virtualización (useVirtualizer)];
        A -- Renderiza (virtualmente) --> D[IconCard];
        D -- Usa --> E[DynamicIcon];
        D -- Provee --> F[Funcionalidad de Copia];
    ```
*   **Descripción:** `IconGalleryClient` es el orquestador que maneja el estado de la búsqueda y la lógica de virtualización. Renderiza una lista virtual de componentes `IconCard`, cada uno de los cuales es responsable de mostrar un icono y manejar la interacción de copia.

## 4. Flujos Críticos de Lógica

1.  **Renderizado Virtualizado:**
    *   **Trigger:** Carga de la página o scroll del usuario.
    *   **Lógica:** El hook `useVirtualizer` se ancla al elemento de scroll principal del layout (`#main-content-scroller`). Calcula qué filas de la cuadrícula de iconos están visibles y renderiza únicamente esos componentes `IconCard` como elementos posicionados absolutamente dentro de un contenedor de tamaño fijo, manteniendo el DOM ligero y performante.
2.  **Filtrado de Iconos:**
    *   **Trigger:** El usuario escribe en el `SearchInput`.
    *   **Lógica:** El `onChange` actualiza el estado `searchTerm`. El hook `useDebounce` retrasa la actualización del `debouncedSearchTerm`. Un `useMemo` se re-calcula cuando `debouncedSearchTerm` cambia, filtrando el array `groupedIcons` y pasando la nueva lista al `useVirtualizer`, que re-calcula y re-renderiza la vista virtual.

## 5. Roadmap de Evolución del Dominio

*   **Completado:** Galería de iconos `lucide-react` con búsqueda, virtualización y copia al portapapeles.
*   **Próximos Pasos (Vigente):**
    1.  **Soporte Multi-Librería:** Extender la UI para permitir al desarrollador cambiar entre las diferentes librerías de iconos definidas en `icon-libraries.config.ts` (`Lucide`, `Tabler`, etc.).
    2.  **Navegación por Categorías:** Añadir una barra lateral o un `Select` que permita filtrar los iconos por las categorías definidas en la librería, si aplica.
    3.  **Expansión a otros Recursos:** Evolucionar la "Galería de Iconos" a una "Librería de Recursos" completa, añadiendo pestañas para visualizar otros activos de diseño como `Brand Kits`, `Paletas de Colores` y `Tipografías`.

// .docs/functionality/010_RESOURCE_LIBRARY_MANIFEST.md