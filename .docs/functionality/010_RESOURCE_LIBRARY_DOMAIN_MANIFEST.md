// .docs/functionality/010_RESOURCE_LIBRARY_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/010_RESOURCE_LIBRARY_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Resource Library" v1.0.
 *              Esta es la SSoT que define la arquitectura de la galería de iconos,
 *              una herramienta interna para desarrolladores. Reemplaza a la versión anterior.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Resource Library"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-005.
*   La `Resource Library` (actualmente la Galería de Iconos) es una **herramienta interna para mejorar la Experiencia de Desarrollador (DX) y la consistencia del diseño**. Su propósito es proporcionar al equipo un "diccionario visual" de los activos de UI disponibles.
*   **Filosofía:** "Visibilidad y Consistencia".

## 2. Funcionalidades Implementadas
*   **Visualización de Biblioteca Completa:** Renderiza todos los iconos de `lucide-react`.
*   **Búsqueda y Filtrado en Tiempo Real:** Un campo de búsqueda `debounced` permite filtrar iconos por nombre.
*   **Copia al Portapapeles:** Al hacer clic en un `IconCard`, el nombre del icono se copia al portapapeles.
*   **Renderizado de Alto Rendimiento (Virtualización):** Utiliza `@tanstack/react-virtual` para renderizar solo los iconos visibles, garantizando una carga instantánea y un scroll fluido.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Datos (Basado en Ficheros)
*   **SSoT de Datos:** El manifiesto `src/config/lucide-icon-names.ts`, generado automáticamente por el script `pnpm gen:icons`.

### 3.2. Arquitectura de Componentes (Frontend)
*   **SSoT de Lógica de UI:** `src/components/resources/IconGalleryClient.tsx`.
*   **Diagrama (Mermaid):**
    ```mermaid
    graph TD
        A[IconGalleryClient] -- Gestiona --> B[Búsqueda (useState + useDebounce)];
        A -- Gestiona --> C[Virtualización (useVirtualizer)];
        A -- Renderiza (virtualmente) --> D[IconCard];
        D -- Usa --> E[DynamicIcon];
    ```
*   **Descripción:** `IconGalleryClient` es el orquestador que maneja el estado de la búsqueda y la lógica de virtualización, renderizando una lista virtual de `IconCard`s.

## 4. Flujos Críticos de Lógica
1.  **Renderizado Virtualizado:** El hook `useVirtualizer` se ancla al elemento de scroll principal (`#main-content-scroller`), calcula qué filas de iconos están visibles y renderiza únicamente esos componentes.
2.  **Filtrado de Iconos:** El `onChange` del `SearchInput` actualiza un estado `searchTerm`. Un `useDebounce` retrasa la actualización del `debouncedSearchTerm`. Un `useMemo` recalcula la lista filtrada, que se pasa al `useVirtualizer`.

## 5. Roadmap de Evolución del Dominio
*   **Completado:** Galería de iconos `lucide-react` con búsqueda, virtualización y copia.
*   **Próximos Pasos (Vigente):**
    1.  **Soporte Multi-Librería:** Extender la UI para cambiar entre las librerías de iconos definidas en `icon-libraries.config.ts`.
    2.  **Navegación por Categorías:** Añadir filtros por categorías de iconos.
    3.  **Expansión a otros Recursos:** Evolucionar a una "Librería de Recursos" completa, añadiendo pestañas para `Brand Kits`, `Paletas de Colores` y `Tipografías`.
// .docs/functionality/010_RESOURCE_LIBRARY_DOMAIN_MANIFEST.md