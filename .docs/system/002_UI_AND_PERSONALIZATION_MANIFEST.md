// .docs/system/002_UI_AND_PERSONALIZATION_MANIFEST.md
/**
 * @file .docs/system/002_UI_AND_PERSONALIZATION_MANIFEST.md
 * @description Manifiesto Canónico de UI y Personalización v1.0.
 *              Esta es la SSoT que define la arquitectura técnica para una UI
 *              completamente personalizable, expandiendo el Pilar 6 de la
 *              Constitución Arquitectónica. Consolida y reemplaza a los
 *              manifiestos de branding duplicados.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de UI y Personalización v1.0

## 1. Filosofía de Diseño: "Calma Enfocada" y "Personalización Soberana"
*   **Referencia a la Constitución:** AD-005.
*   **Calma Enfocada:** Nuestra identidad visual base se basa en una estética premium y oscura, dinamizada por puntos focales de color de alta intensidad que guían la acción del usuario.
*   **Personalización Soberana:** La arquitectura de la UI está diseñada para ser un **camaleón**. Cada aspecto visual (colores, fuentes, iconos) es una variable que puede ser redefinida desde una única fuente de verdad (SSoT).

## 2. Pilares Técnicos de la Arquitectura de Personalización

### 2.1. Pilar Técnico 1: La SSoT de Tokens de Diseño (Variables CSS)
*   **SSoT Técnica:** `src/app/globals.css`.
*   **Implementación:**
    1.  Este archivo define **todos** los tokens de diseño de la aplicación como variables CSS (`--primary`, `--background`, `--radius`).
    2.  Se definen múltiples temas (ej. `.dark`, `.light`) que simplemente sobrescriben estos tokens.
    3.  El componente `ThemeProvider` (`next-themes`) gestiona qué clase de tema se aplica al `<html>`, activando el conjunto de variables correspondiente.
*   **Consumo:** Los componentes de UI (y `tailwind.config.mjs`) **nunca** usan valores codificados en duro. Siempre consumen estas variables CSS (ej. `bg-primary`).

### 2.2. Pilar Técnico 2: Intercambiabilidad de Iconos (Inyección de Dependencias)
*   **SSoT Técnica:** `src/config/icon-libraries.config.ts` y `src/lib/context/IconLibraryContext.tsx`.
*   **Implementación:**
    1.  Un **manifiesto** (`icon-libraries.config.ts`) declara las librerías de iconos soportadas y cómo cargarlas dinámicamente.
    2.  La **preferencia del usuario** se almacena en `profiles.dashboard_layout.activeIconLibraryId`.
    3.  El `IconLibraryProvider` lee esta preferencia, carga dinámicamente la librería seleccionada y la provee a través de un `Contexto de React`.
    4.  El componente atómico `DynamicIcon.tsx` consume este contexto y renderiza el icono solicitado de la librería activa.
*   **Consecuencia:** Para cambiar el set de iconos de toda la aplicación, solo se necesita cambiar la preferencia del usuario. Ningún componente de UI necesita ser modificado.

### 2.3. Pilar Técnico 3: Propagación de Estilos Globales
*   **Propósito:** Asegurar que cambios en la SSoT se propaguen a todos los aparatos sin intervención manual.
*   **Mecanismo:**
    *   **Fuentes:** La fuente global se define como una variable CSS (`--font-geist-sans`) en `globals.css` y se aplica al `<body>`.
    *   **Colores:** Todos los componentes utilizan las clases semánticas de Tailwind (`bg-primary`, `text-destructive`), que están vinculadas a las variables CSS.
    *   **Radios de Borde:** El radio de borde (`--radius`) se define como una variable y se consume en `tailwind.config.mjs`.
// .docs/system/002_UI_AND_PERSONALIZATION_MANIFEST.md