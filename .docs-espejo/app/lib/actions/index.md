// .docs/espejo/app/lib/actions/index.md
/**
 * @file .docs/espejo/app/lib/actions/index.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto de Server Actions,
 *              ubicado en su ruta canónica espejada.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 9.1.0
 */
# Manifiesto Conceptual: API de Server Actions

## 1. Rol Estratégico y Propósito
Este aparato es el **manifiesto principal y la API pública** para toda la capa de lógica de negocio del servidor. Su única responsabilidad es ensamblar todos los módulos de acción atómicos (ej. `sites.actions.ts`, `workspaces.actions.ts`) y exportarlos bajo un único namespace (`actions`).

Actúa como una fachada (Facade Pattern), proveyendo a la aplicación un punto de entrada único, cohesivo y predecible para invocar la lógica de negocio.

## 2. Arquitectura del Contenido
1.  **Importaciones Atómicas:** El archivo importa cada módulo de acción de forma individual usando `import * as [domain] from "./[domain].actions"`.
2.  **Exportación Namespaced:** Todas las importaciones se agrupan y se exportan como un único objeto.
3.  **Agnosticismo de Runtime:** Este archivo **NO DEBE** contener directivas como `"use server"`. Es un módulo de resolución que debe ser accesible tanto en el servidor como en el cliente.

## 3. Contrato de API
- **Formato de Salida:** Un objeto JavaScript que contiene todos los módulos de acción, cada uno como una propiedad namespaced.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Generación Automática de Manifiesto:** Crear un script (`pnpm gen:manifests`) que lea el directorio `actions/` y construya las exportaciones automáticamente.
 * 2.  **Verificación de Integridad en CI/CD:** Implementar un paso en el pipeline de CI/CD que ejecute el script de generación y falle si detecta una desincronización.
 * 3.  **Exportaciones Nombradas Explícitas:** Refactorizar para usar exportaciones nombradas explícitas (`export { sites } from './sites.actions'`).
 * 4.  **Documentación de API Pública:** Añadir TSDoc a cada re-exportación para clarificar el dominio de negocio expuesto.
 * 5.  **Manejo de Sub-dominios:** Si un dominio de acción se vuelve complejo, el manifiesto podría exportar namespaces anidados.
 * 6.  **Control de Visibilidad de API:** Introducir un mecanismo para marcar acciones como "internas" y excluirlas de la API pública.
 * 7.  **Versionado de la API de Acciones:** Añadir metadatos de versión al objeto exportado.
 * 8.  **Logging de Acceso al Manifiesto:** En desarrollo, envolver la exportación en un `Proxy` para registrar qué componente accede a qué módulo.
 * 9.  **Análisis de Dependencias de Acciones:** Crear un script que analice este manifiesto y genere un grafo de dependencias.
 * 10. **Internacionalización de la Documentación:** Traducir este documento espejo.
 * =====================================================================
 */
// .docs/espejo/app/lib/actions/index.md