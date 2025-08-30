// .docs/system/001_BRANDING_AND_UI_CUSTOMIZATION_MANIFEST.md
/**
 * @file .docs/system/001_BRANDING_AND_UI_CUSTOMIZATION_MANIFEST.md
 * @description Manifiesto Canónico de Branding y Personalización de UI v1.0.
 *              Esta es la SSoT definitiva que define la identidad visual de `ConvertiKit`
 *              y la arquitectura técnica para una UI completamente personalizable.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Branding y Personalización de UI v1.0

## 1. Filosofía de Diseño: "Calma Enfocada" y "Personalización Soberana"

*   **Calma Enfocada:** Nuestra identidad visual base se basa en una estética premium y oscura, dinamizada por puntos focales de color de alta intensidad que guían la acción del usuario.
*   **Personalización Soberana:** La arquitectura de la UI está diseñada para ser un **camaleón**. Cada aspecto visual (colores, fuentes, iconos) es una variable que puede ser redefinida desde una única fuente de verdad (SSoT), permitiendo re-skins completos de la aplicación o la creación de múltiples temas sin refactorizar componentes.

## 2. Pilares de la Arquitectura de Personalización

### 2.1. Pilar 1: La SSoT de Tokens de Diseño (Variables CSS)

*   **SSoT Técnica:** `src/app/globals.css`.
*   **Implementación:**
    1.  Este archivo define **todos** los tokens de diseño de la aplicación como variables CSS (`--primary`, `--background`, `--radius`, `--font-geist-sans`).
    2.  Se definen múltiples temas (ej. `.dark`, `.light`, y futuros como `.corporate`) que simplemente sobrescriben estos tokens.
    3.  El componente `ThemeProvider` (`next-themes`) gestiona qué clase de tema se aplica al `<html>`, activando el conjunto de variables correspondiente.
*   **Consumo:** Los componentes de UI (y `tailwind.config.mjs`) **nunca** usan valores de color/fuente codificados en duro. Siempre consumen estas variables CSS (ej. `bg-primary`, `font-sans`).

*   **Diagrama de Flujo (Mermaid):**
    ```mermaid
    graph TD
        A[globals.css (Define --primary)] --> B[tailwind.config.mjs (Usa var(--primary))];
        B --> C[Componentes UI (Usan bg-primary)];
        D[ThemeProvider (Aplica clase .dark/.light)] --> C;
    ```

### 2.2. Pilar 2: Intercambiabilidad de Iconos (Inyección de Dependencias)

*   **SSoT Técnica:** `src/config/icon-libraries.config.ts` y `src/lib/context/IconLibraryContext.tsx`.
*   **Implementación:**
    1.  El **manifiesto** `icon-libraries.config.ts` declara las librerías de iconos soportadas y cómo cargarlas dinámicamente.
    2.  La **preferencia del usuario** se almacena en `profiles.dashboard_layout.activeIconLibraryId`.
    3.  El `IconLibraryProvider` lee esta preferencia, carga dinámicamente la librería de iconos seleccionada y la provee a través de un `Contexto de React`.
    4.  El componente atómico `DynamicIcon.tsx` consume este contexto y renderiza el icono solicitado de la librería activa.
*   **Consecuencia:** Para cambiar el set de iconos de toda la aplicación, solo se necesita cambiar la preferencia del usuario o la librería por defecto en el `IconLibraryProvider`. Ningún componente de UI necesita ser modificado.

### 2.3. Pilar 3: Propagación de Estilos Globales

*   **Propósito:** Asegurar que cambios en la SSoT se propaguen a todos los aparatos sin intervención manual.
*   **Mecanismo:**
    *   **Fuentes:** La fuente global se define como una variable CSS (`--font-geist-sans`) en `globals.css` y se aplica al `<body>`. Todos los componentes heredan esta fuente por defecto.
    *   **Colores:** Todos los componentes utilizan las clases semánticas de Tailwind (`bg-primary`, `text-destructive`), que están vinculadas a las variables CSS. Cambiar `--primary` en `globals.css` cambia el color de todos los botones primarios, enlaces, etc.
    *   **Radios de Borde:** El radio de borde (`--radius`) se define como una variable y se consume en `tailwind.config.mjs` para generar las clases `rounded-lg`, `rounded-md`, etc.

## 3. Roadmap de Evolución del Dominio

*   **Completado:**
    *   Arquitectura basada en variables CSS.
    *   Infraestructura para intercambiabilidad de iconos.
    *   Componente `ThemeProvider` para temas claro/oscuro.
*   **Próximos Pasos (Vigente):**
    1.  **Crear Manifiesto de Tipografía:** Documentar la escala tipográfica (`text-sm`, `text-lg`, etc.) y las reglas de jerarquía visual.
    2.  **Implementar UI de Selección de Iconos:** Crear la UI en los ajustes de perfil para que el usuario pueda cambiar su `activeIconLibraryId`.
    3.  **Explorar Temas Adicionales:** Crear nuevas clases de tema en `globals.css` (ej. `.high-contrast`) y permitir al usuario seleccionarlas a través del `ThemeSwitcher`.

// .docs/system/001_BRANDING_AND_UI_CUSTOMIZATION_MANIFEST.md