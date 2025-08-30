// .docs/espejo/lib/actions/index.md
/**
 * @file .docs/espejo/lib/actions/index.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto de Server Actions.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 9.0.0
 */
# Manifiesto Conceptual: API de Server Actions

## 1. Rol Estratégico y Propósito
Este aparato es el **manifiesto principal y la API pública** para toda la capa de lógica de negocio del servidor. Su única responsabilidad es ensamblar todos los módulos de acción atómicos (ej. `sites.actions.ts`, `workspaces.actions.ts`) y exportarlos bajo un único namespace (`actions`).

Actúa como una fachada (Facade Pattern), proveyendo a la aplicación (especialmente a los Componentes de Cliente) un punto de entrada único, cohesivo y predecible para invocar la lógica de negocio, mientras oculta la complejidad de la estructura de archivos interna.

## 2. Arquitectura del Contenido
1.  **Importaciones Atómicas:** El archivo importa cada módulo de acción de forma individual usando la sintaxis `import * as [domain] from "./[domain].actions"`.
2.  **Exportación Namespaced:** Todas las importaciones se agrupan y se exportan como un único objeto, permitiendo un consumo namespaced (ej. `actions.sites.createSiteAction`).
3.  **Agnosticismo de Runtime:** Este archivo **NO DEBE** contener directivas de runtime como `"use server"` o `"server-only"`. Es un módulo de resolución que debe ser accesible tanto en el servidor como en el cliente (para pasar referencias de funciones). La restricción de ejecución en el servidor es responsabilidad de los archivos de acción individuales.

## 3. Contrato de API
- **Formato de Salida:** Un objeto JavaScript que contiene todos los módulos de acción, cada uno como una propiedad namespaced.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Generación Automática de Manifiesto:** Para una DX de élite, este archivo es un candidato ideal para ser generado y mantenido por un script (`pnpm gen:manifests`) que lea la estructura del directorio `actions/` y construya las exportaciones automáticamente.
 * 2.  **Verificación de Integridad en CI/CD:** Implementar un paso en el pipeline de CI/CD que ejecute el script de generación y falle si detecta una desincronización entre el archivo y la estructura del directorio.
 * 3.  **Exportaciones Nombradas Explícitas:** Para una claridad máxima de la API, se podría refactorizar para usar exportaciones nombradas explícitas (`export { sites } from './sites.actions'`).
 * 4.  **Documentación de API Pública:** Añadir TSDoc a cada re-exportación para clarificar qué dominio de negocio está siendo expuesto por cada módulo.
 * 5.  **Manejo de Sub-dominios:** Si un dominio de acción se vuelve muy complejo (ej. `actions/campaigns/analytics/`), el manifiesto podría exportar namespaces anidados (`actions.campaigns.analytics`).
 * 6.  **Control de Visibilidad de API:** Introducir un mecanismo para marcar ciertas acciones como "internas" y excluirlas de esta API pública.
 * 7.  **Versionado de la API de Acciones:** Añadir metadatos de versión al objeto exportado para que los clientes puedan verificar la compatibilidad.
 * 8.  **Logging de Acceso al Manifiesto:** En modo de desarrollo, envolver la exportación en un `Proxy` para registrar qué componente está accediendo a qué módulo de acción.
 * 9.  **Análisis de Dependencias de Acciones:** Crear un script que analice este manifiesto y genere un grafo de las dependencias entre los diferentes módulos de acción.
 * 10. **Internacionalización de la Documentación:** Traducir este documento espejo para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/lib/actions/index.md