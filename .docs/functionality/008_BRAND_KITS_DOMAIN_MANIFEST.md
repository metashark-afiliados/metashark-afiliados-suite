// .docs/functionality/008_BRAND_KITS_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/008_BRAND_KITS_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Brand Kits & Personalization" v1.0.
 *              Esta es la SSoT que define la arquitectura para el sistema de
 *              personalización de la identidad visual. Reemplaza a la versión anterior.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Brand Kits & Personalization"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** Pilar 6.
*   Este dominio permite a los usuarios **infundir su propia identidad de marca en sus creaciones**, transformando plantillas genéricas en activos de marketing consistentes.
*   **Filosofía:** "Configuración sobre Código, Consistencia sin Esfuerzo". El usuario gestiona `Brand Kits`, y el sistema propaga automáticamente los estilos.

## 2. Funcionalidades Planificadas
*   **Gestión de Brand Kits:** Los usuarios podrán crear, editar y eliminar múltiples `Brand Kits` (paleta de colores, tipografías, logos).
*   **Aplicación en el Builder:** El `SettingsPanel` del Builder permitirá seleccionar un `Brand Kit`. Al aplicarlo, todos los bloques en el `Canvas` actualizarán sus estilos.
*   **Intercambiabilidad de Iconos:** El usuario podrá seleccionar una librería de iconos (`Lucide`, `Tabler`) en los ajustes de su perfil.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Entidad-Relación (Base de Datos)
*   **SSoT de Datos:** Tabla `brand_kits` y la columna `dashboard_layout` (JSONB) en `profiles`.
*   **Descripción:** `brand_kits` almacena las definiciones de marca. La preferencia de la librería de iconos se almacena en `profiles`.

### 3.2. Arquitectura de Estilos (Backend-Driven CSS)
*   **SSoT Técnica:** `src/app/globals.css` y el `themeSlice` de Zustand.
*   **Flujo de Estilos:**
    1.  El `themeSlice` del Builder almacena el tema activo.
    2.  El componente `IFrame` del `Canvas` lee este estado.
    3.  Inyecta un tag `<style>` en el `<head>` del iframe que define variables CSS: `:root { --theme-primary: #ADFF2F; }`.
    4.  Los componentes de bloque consumen estas variables (`bg-[--theme-primary]`), aplicando el tema dinámicamente.

## 4. Flujos de Lógica de Negocio
*   **SSoT de Lógica de Negocio:** `brand_kits.actions.ts` (futuro) y `profiles.actions.ts`.
*   **Flujos Críticos:**
    1.  **Aplicar Brand Kit:** La UI invoca la acción `updateGlobalStyle` en el `themeSlice` de Zustand para cada color y fuente del `Brand Kit`.
    2.  **Guardar Preferencia de Iconos (`updateProfilePreferencesAction`):** La `Server Action` actualiza el JSON `dashboard_layout` en la tabla `profiles`.

## 5. Roadmap de Evolución del Dominio
*   **Completado:** Esquema de DB (`brand_kits`), infraestructura para intercambiabilidad de iconos, `themeSlice` en `BuilderStore`.
*   **Próximos Pasos (Vigente):**
    1.  Crear UI de **Gestión de Brand Kits** en `/dashboard/brand`.
    2.  Implementar **Server Actions** para `brand_kits` (CRUD).
    3.  Integrar `Brand Kits` con el `SettingsPanel` del Builder.
    4.  Implementar UI de **Selección de Iconos** en los ajustes de perfil.
// .docs/functionality/008_BRAND_KITS_DOMAIN_MANIFEST.md