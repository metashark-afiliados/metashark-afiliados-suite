// .docs/001_BRANDING_AND_UI_CUSTOMIZATION_MANIFEST.md
/**
 * @file .docs/001_BRANDING_AND_UI_CUSTOMIZATION_MANIFEST.md
 * @description Manifiesto Canónico de Branding y Personalización de UI v1.0.
 *              Esta es la Única Fuente de Verdad (SSoT) definitiva que define la
 *              identidad visual de "ConvertiKit" y la arquitectura técnica para
 *              la personalización de la interfaz por parte del usuario.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Branding y Personalización de UI v1.0

## 1. Filosofía de Diseño: "Calma Enfocada"

Nuestra identidad visual se basa en la filosofía de **"Calma Enfocada"**: una estética premium y oscura, dinamizada por puntos focales de color de alta intensidad que guían la acción del usuario sin generar ruido visual. El objetivo es proyectar sofisticación, confianza y control, permitiendo que la marca del usuario final sea la verdadera protagonista.

## 2. Pilares de la Arquitectura de Personalización

La arquitectura de personalización es agnóstica y se basa en la **configuración sobre el código**. Los usuarios no editan CSS; configuran manifiestos de marca que el sistema interpreta.

*   **Pilar 1: Brand Kits (SSoT de la Marca del Usuario)**
    *   **Entidad:** `brand_kits` (tabla en la base de datos).
    *   **Lógica:** Cada `Workspace` puede tener múltiples `Brand Kits`. Un `Brand Kit` almacena la SSoT de la identidad de una marca: paleta de colores, tipografías y logos.
*   **Pilar 2: Intercambiabilidad de Iconos (Flexibilidad Visual)**
    *   **Entidad:** Manifiesto `icon-libraries.config.ts` y preferencia del usuario en `profiles.dashboard_layout`.
    *   **Lógica:** La aplicación permite al usuario seleccionar una librería de iconos (`Lucide`, `Tabler`, etc.) para su entorno de trabajo, desacoplando la UI de una única implementación de iconos.

## 3. Implementación Técnica de Élite

### 3.1. Paleta de Colores y Estilos Globales (Backend-Driven CSS)

*   **Flujo de Datos:**
    1.  El usuario define su paleta de colores en un `Brand Kit` a través de la UI del dashboard.
    2.  Los valores (ej. `{ "primary": "#ADFF2F", "background": "#111827" }`) se guardan en la columna `brand_kits.colors` (JSONB).
    3.  Al renderizar una campaña, el servidor lee el `Brand Kit` aplicado.
    4.  Estos valores se inyectan como **variables CSS** en el `<head>` del documento.
*   **SSoT Técnica:**
    *   `src/app/globals.css`: Define las variables CSS canónicas con valores por defecto (ej. `--primary: 74 92% 56%;`).
    *   **Componentes de UI:** Utilizan estas variables (ej. `bg-primary`, que Tailwind mapea a `hsl(var(--primary))`).
    *   **Lógica de Inyección:** La capa de servidor (Server Component o layout) es responsable de inyectar un `<style>` tag que sobrescribe estas variables con los valores del `Brand Kit` del usuario.

### 3.2. Intercambiabilidad de Librerías de Iconos

*   **Flujo de Datos:**
    1.  El usuario selecciona su librería de iconos preferida en los ajustes de su perfil.
    2.  La preferencia (`'lucide'` o `'tabler'`) se guarda en la columna `profiles.dashboard_layout` (JSONB).
    3.  La aplicación, en el `RootLayout`, lee esta preferencia.
*   **SSoT Técnica:**
    *   **`src/config/icon-libraries.config.ts`:** Manifiesto que define las librerías soportadas y una función `importFn` para su carga dinámica.
    *   **`src/lib/context/IconLibraryContext.tsx`:** Un `Context Provider` que lee la preferencia del usuario, ejecuta la `importFn` correspondiente y provee el mapa de componentes de iconos a toda la aplicación.
    *   **`src/components/ui/DynamicIcon.tsx`:** Componente de UI atómico que consume el contexto y renderiza el icono solicitado de la librería activa.

// .docs/001_BRANDING_AND_UI_CUSTOMIZATION_MANIFEST.md