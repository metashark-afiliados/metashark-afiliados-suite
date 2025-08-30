// .docs/espejo/system/006_PROJECT_STRUCTURE_MANIFEST.md
/**
 * @file .docs/espejo/system/006_PROJECT_STRUCTURE_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto de Estructura del Proyecto.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Estructura del Proyecto v1.0

## 1. Rol Estratégico y Propósito
Este documento es el **mapa maestro canónico** de la base de código de ConvertiKit. Su propósito es definir la estructura de directorios y la responsabilidad de cada capa y dominio arquitectónico. Sirve como la guía de navegación fundamental para el equipo de ingeniería, acelerando el onboarding y garantizando que los nuevos aparatos se creen en su ubicación correcta.

## 2. Arquitectura del Contenido
El manifiesto se estructura como un desglose jerárquico de la arquitectura de directorios, comenzando desde la raíz del proyecto y profundizando en el directorio `src/`. Para cada directorio clave, se define:
1.  **Propósito:** La responsabilidad única de esa capa o dominio.
2.  **Contenido:** El tipo de aparatos que deben residir en él.

## 3. Contrato de API
- **Formato de Entrada:** Contenido del manifiesto de arquitectura de proyecto obsoleto.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT para la estructura de directorios del proyecto.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Diagrama de Flujo de Directorios:** Incluir un diagrama de Mermaid que visualice la jerarquía de directorios y las dependencias entre las capas.
 * 2.  **Validación de Estructura en CI/CD:** Crear un script que se ejecute en el pipeline de CI/CD para validar que no se hayan introducido archivos en directorios incorrectos (ej. un `Server Action` fuera de `src/lib/actions/`).
 * 3.  **Generadores de Código (Scaffolding):** Desarrollar scripts (`pnpm gen:component`, `pnpm gen:action`) que utilicen este manifiesto como plantilla para crear nuevos aparatos en su ubicación correcta con el boilerplate necesario.
 * 4.  **Enlaces a la Documentación Espejo:** Para cada directorio, enlazar al directorio correspondiente en `.docs/espejo/`.
 * 5.  **Sección de "Dónde No Poner las Cosas":** Añadir una sección de anti-patrones que describa explícitamente dónde no deben colocarse ciertos tipos de archivos.
 * 6.  **Documentación de Flujo de Datos entre Capas:** Detallar cómo fluyen los datos entre las diferentes capas (ej. `src/app/` invoca `src/lib/actions/`, que invoca `src/lib/data/`).
 * 7.  **Integración con IDE:** Crear configuraciones para VSCode que utilicen este manifiesto para proporcionar snippets y sugerencias de ubicación de archivos.
 * 8.  **Mapa de Cobertura de Pruebas:** Superponer información sobre la cobertura de pruebas de cada directorio, indicando visualmente las áreas con menor cobertura.
 * 9.  **Análisis de Acoplamiento:** Utilizar herramientas de análisis estático para medir el acoplamiento entre los directorios y validar que se respeten los límites de las capas.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/system/006_PROJECT_STRUCTURE_MANIFEST.md