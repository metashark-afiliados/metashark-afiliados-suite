// .docs/espejo/system/007_I18N_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/espejo/system/007_I18N_ARCHITECTURE_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto de Arquitectura de Internacionalización.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Arquitectura de Internacionalización (IMAS) v1.0

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que detalla la implementación técnica de la filosofía **"Construir Contratos, No Redefinirlos"**, correspondiente al **Pilar 7 de la Constitución Arquitectónica**. Su propósito es servir como una guía técnica profunda para los ingenieros sobre la **IMAS (Internationalization Modular Atomic Strategy)**, asegurando que toda la aplicación sea completamente traducible, tipo-segura y mantenible.

## 2. Arquitectura del Contenido
El manifiesto se estructura en las tres capas de la arquitectura IMAS:
1.  **Capa de Contenido Atómico (`src/messages/`):** Detalla la estructura y propósito de los archivos de mensajes `.json`.
2.  **Capa de Contratos Atómicos (`src/lib/validators/i18n/`):** Explica el rol de los schemas Zod para validar la estructura de cada `.json`.
3.  **Capa de Ensamblaje por Composición:** Documenta el patrón canónico de cómo los schemas de nivel superior (páginas, componentes complejos) deben importar y fusionar (`.merge()`) los schemas de los componentes atómicos que consumen, adhiriéndose al principio DRY.

## 3. Contrato de API
- **Formato de Entrada:** Contenido consolidado del manifiesto IMAS obsoleto y las directivas del Pilar 7.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT técnica detallada para la arquitectura de internacionalización.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Generación Automática de Schemas:** Desarrollar un script que, dado un nuevo archivo `.json`, genere un schema Zod básico para él.
 * 2.  **Linter para Composición de Schemas:** Crear una regla de ESLint personalizada que detecte cuando un schema de página redefine claves de un sub-componente en lugar de importarlo y fusionarlo.
 * 3.  **Integración con Servicio de Traducción (TMS):** Documentar el flujo de trabajo para exportar los archivos `.json` a un Sistema de Gestión de Traducción (como Lokalise o Crowdin) y luego importar las traducciones completadas.
 * 4.  **Validación de Placeholders:** Estandarizar y validar la presencia de placeholders (ej. `{username}`) en los schemas Zod usando `.refine()` o `.describe()`.
 * 5.  **Gestión de Pluralización:** Documentar el patrón canónico para manejar reglas de pluralización complejas utilizando las capacidades de `next-intl`.
 * 6.  **Extracción Automática de Claves:** Investigar herramientas que puedan escanear el código fuente (`.tsx`), encontrar strings "hardcodeadas" y sugerir su extracción a archivos de i18n.
 * 7.  **Dashboard de Cobertura de Traducción:** Crear una vista en el Dev Console que analice los archivos de mensajes y muestre un reporte de qué namespaces o claves faltan por traducir en cada locale.
 * 8.  **Pruebas de Integración de i18n:** Documentar la estrategia para escribir pruebas que rendericen un componente en diferentes locales y verifiquen que el texto correcto se muestra.
 * 9.  **Formateo de Fechas y Números:** Expandir el manifiesto para incluir la SSoT sobre cómo usar `useFormatter` para un formato localizado de fechas, números y monedas.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/system/007_I18N_ARCHITECTURE_MANIFEST.md