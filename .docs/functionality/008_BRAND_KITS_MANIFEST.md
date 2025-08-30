// .docs/functionality/008_BRAND_KITS_MANIFEST.md
/**
 * @file .docs/functionality/008_BRAND_KITS_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Brand Kits & Personalization" v1.0.
 *              Esta es la SSoT que define el propósito, la arquitectura y la
 *              lógica de negocio para el sistema de personalización de la
 *              identidad visual en ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Brand Kits & Personalization"

## 1. Rol Estratégico y Propósito de Negocio

Este dominio permite a los usuarios **infundir su propia identidad de marca en sus creaciones**. Su propósito es transformar las plantillas genéricas en activos de marketing que se sientan 100% nativos de la marca del usuario, aumentando la profesionalidad y la confianza del cliente final. Estratégicamente, es una característica premium esencial para agencias y negocios establecidos.

*   **Filosofía:** "Configuración sobre Código, Consistencia sin Esfuerzo". El usuario no manipula estilos directamente; gestiona `Brand Kits`. Al aplicar un `Brand Kit`, el sistema propaga automáticamente los colores, fuentes y logos a través de toda una `Creation`, garantizando la consistencia de la marca con un solo clic.

## 2. Funcionalidades Planificadas

*   **Gestión de Brand Kits:** Los usuarios podrán crear, editar y eliminar múltiples `Brand Kits` dentro de su `Workspace`.
*   **Definición de Marca:** Cada `Brand Kit` permitirá definir:
    *   Una paleta de colores (primario, secundario, acento, etc.).
    *   Tipografías para encabezados y cuerpo de texto.
    *   Logos (primario, secundario, favicon).
*   **Aplicación de Marca en el Builder:** En el `SettingsPanel` del Builder, el usuario podrá seleccionar un `Brand Kit` de su `Workspace`. Al aplicarlo, todos los bloques en el `Canvas` actualizarán sus estilos para reflejar la marca seleccionada.
*   **Intercambiabilidad de Iconos:** El usuario podrá seleccionar una librería de iconos (`Lucide`, `Tabler`) en los ajustes de su perfil, y esta preferencia se aplicará a todos los iconos en su `Dashboard` y en el `Builder`.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Entidad-Relación (Base de Datos)

*   **SSoT de Datos:** Tabla `brand_kits` y la columna `dashboard_layout` (JSONB) en `profiles`.
*   **Diagrama de Flujo de Datos:**
    ```mermaid
    graph TD
        subgraph "Dashboard (Gestión)"
            A[UI de Gestión de Brand Kits] <--> B[brand_kits.actions.ts];
            B <--> C((db.brand_kits));
        end
        
        subgraph "Builder (Aplicación)"
            D[SettingsPanel] -- Selecciona --> E{themeSlice (Zustand)};
            E -- Aplica --> F[Canvas];
            G[profiles.actions.ts] <--> H((db.profiles.dashboard_layout));
        end
        
        B -- Lee --> H;
    ```
*   **Descripción:** `brand_kits` almacena las definiciones de marca. El `themeSlice` en el store de Zustand del Builder mantiene el tema activo de la `Creation`, que puede ser hidratado desde un `Brand Kit`. La preferencia de la librería de iconos se almacena en `profiles`.

### 3.2. Arquitectura de Estilos (Backend-Driven CSS)

*   **SSoT Técnica:** `src/app/globals.css` (define las variables CSS por defecto) y el `themeSlice` de Zustand (sobrescribe las variables).
*   **Flujo de Estilos:**
    1.  El `themeSlice` del Builder almacena el tema activo (ej. `{ globalColors: { primary: '#ADFF2F' } }`).
    2.  El componente `IFrame` del `Canvas` lee este estado.
    3.  Inyecta un tag `<style>` en el `<head>` del iframe que define variables CSS: `:root { --theme-primary: #ADFF2F; }`.
    4.  Los componentes de bloque (`Header1`, `Hero1`) están estilizados con clases de Tailwind que consumen estas variables (ej. `bg-[--theme-primary]`), aplicando así el tema dinámicamente.

## 4. Flujos de Lógica de Negocio

*   **SSoT de Lógica de Negocio:** `src/lib/actions/brand_kits.actions.ts` (futuro) y `profiles.actions.ts`.
*   **Flujos Críticos:**
    1.  **Aplicar Brand Kit (`applyBrandKitAction` - Futura):**
        *   **Trigger:** Usuario selecciona un `Brand Kit` en el `SettingsPanel` del Builder.
        *   **Lógica:** La UI invoca la acción `updateGlobalStyle` en el `themeSlice` de Zustand para cada color y fuente del `Brand Kit`, actualizando instantáneamente el `Canvas`.
    2.  **Guardar Preferencia de Iconos (`updateProfilePreferencesAction`):**
        *   **Trigger:** Usuario selecciona una librería de iconos en los ajustes de perfil.
        *   **Lógica:** La `Server Action` actualiza el JSON `dashboard_layout` en la tabla `profiles` con el `activeIconLibraryId` seleccionado. El `IconLibraryProvider` lee esta preferencia en la siguiente carga de página.

## 5. Roadmap de Evolución del Dominio

*   **Completado:**
    *   Definición del esquema de base de datos (`brand_kits`).
    *   Infraestructura para intercambiabilidad de iconos (Contexto, Manifiesto, `DynamicIcon`).
    *   `themeSlice` en el `BuilderStore` para gestionar el estado del tema.
*   **Próximos Pasos (Vigente):**
    1.  **Crear UI de Gestión de Brand Kits:** Desarrollar la página `/dashboard/brand` donde los usuarios puedan realizar el CRUD de sus `Brand Kits`.
    2.  **Implementar Server Actions `brand_kits.actions.ts`:** Crear las acciones para `create`, `update` y `delete` Brand Kits.
    3.  **Integrar `Brand Kits` con el `SettingsPanel`:** Conectar la UI del Builder para que pueda leer los `Brand Kits` del `Workspace` activo y aplicarlos al `themeSlice` de Zustand.
    4.  **Implementar UI de Selección de Iconos:** Crear el selector en los ajustes de perfil para que los usuarios puedan cambiar su `activeIconLibraryId`.

// .docs/functionality/008_BRAND_KITS_MANIFEST.md