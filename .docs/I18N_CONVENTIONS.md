// .docs/I18N_CONVENTIONS.md
/**
 * @file .docs/I18N_CONVENTIONS.md
 * @description Manifiesto Canónico y Única Fuente de Verdad (SSoT) para la
 *              Arquitectura de Internacionalización de Élite v5.0 del proyecto ConvertiKit.
 *              Este documento define el sistema "IMAS" (I18n Mirrored Atomic Structure).
 * @author Raz Podestá
 * @version 1.0.0
 */

# PROMPT DE ARQUITECTURA I18N: "IMAS" (I18N Mirrored Atomic Structure)

## 1. MISIÓN Y FILOSOFÍA

Implementar una arquitectura de internacionalización que sea simultáneamente de **alta mantenibilidad, máxima escalabilidad y rendimiento de élite**. La filosofía se basa en dos principios:

1.  **Atomicidad y Cohesión:** Las traducciones de un aparato deben vivir lógicamente junto a él, pero sin contaminar su espacio de trabajo.
2.  **Configuración sobre Convención:** La estructura debe ser explícita y fácil de auditar, tanto para humanos como para herramientas automáticas.

## 2. ARQUITECTURA DE ARCHIVOS (ESTRUCTURA ESPEJO)

El sistema de i18n se basa en una estructura de directorios espejo (`src/messages/`) que replica la estructura de los aparatos de la aplicación (`src/app/` y `src/components/`).

-   **Directorio Raíz de Mensajes:** `src/messages/`
-   **Estructura Interna:** Refleja la ruta exacta del aparato al que provee traducciones.
-   **Nomenclatura de Archivos:** El archivo de traducción se llama igual que el archivo del componente, pero con la extensión `.json`.

**Ejemplo Canónico:**
src/
├── app/
│ └── [locale]/
│ └── dashboard/
│ └── page.tsx
├── components/
│ └── layout/
│ └── DashboardHeader.tsx
└── messages/ <-- Directorio Espejo de i18n
├── app/
│ └── [locale]/
│ └── dashboard/
│ └── page.json <-- Traducciones para la PÁGINA del dashboard
└── components/
└── layout/
└── DashboardHeader.json <-- Traducciones para el COMPONENTE del header
code
Code
## 3. FORMATO DEL ARCHIVO DE MENSAJES ATÓMICO

Cada archivo `.json` de traducción es una unidad autocontenida que define las cadenas de texto para **todos los idiomas soportados** para ese único aparato.

**Ejemplo: `src/messages/components/layout/DashboardHeader.json`**

```json
{
  "en-US": {
    "search_placeholder": "Search...",
    "search_command": "⌘K"
  },
  "es-ES": {
    "search_placeholder": "Buscar...",
    "search_command": "⌘K"
  },
  "pt-BR": {
    "search_placeholder": "Buscar...",
    "search_command": "⌘K"
  }
}
4. SISTEMA DE CARGA Y ORQUESTACIÓN (src/i18n.ts)
El orquestador src/i18n.ts es un ensamblador dinámico y cacheado.
Lógica de Ejecución:
En la primera petición para un locale (ej. es-ES), el orquestador escanea recursivamente el directorio src/messages/.
Lee cada archivo .json que encuentra.
Extrae el bloque de traducciones correspondiente al locale solicitado (el bloque "es-ES": {...}).
Utiliza la ruta del archivo para crear un namespace (ej. components/layout/DashboardHeader.json -> components.layout.DashboardHeader).
Ensambla un único objeto gigante de mensajes en memoria para ese locale.
Rendimiento: El resultado de este ensamblaje es cacheado agresivamente con unstable_cache de Next.js, por lo que el escaneo de archivos solo ocurre una vez por build/revalidación.
5. CONSUMO EN COMPONENTES
El consumo por parte de los componentes de cliente permanece sin cambios, utilizando el hook useTranslations. El namespace pasado al hook ahora se deriva de la ruta del archivo de mensajes.
Ejemplo en DashboardHeader.tsx:
code
TypeScript
import { useTranslations } from "next-intl";

// El namespace se deriva de la ruta del archivo de mensajes
// El orquestador se encarga de que las claves estén disponibles bajo este namespace
const t = useTranslations("components.layout.DashboardHeader");

// Uso: t("search_placeholder")
---
