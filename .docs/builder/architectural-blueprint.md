// .docs/builder/architectural-blueprint.md
/**
 * @file .docs/builder/architectural-blueprint.md
 * @description Blueprint Arquitectónico del Constructor de Campañas.
 *              Este documento sirve como la Única Fuente de Verdad para la
 *              arquitectura del "Builder", reflejando el estado actual post-migración.
 * @author Raz Podestá
 * @version 1.0.0
 */
# Blueprint Arquitectónico del Constructor de Campañas de ConvertiKit

## Visión General

El Constructor de Campañas (el "Builder") es el núcleo funcional de ConvertiKit. La visión es un editor visual (WYSIWYG) modular, con estado centralizado y renderizado desacoplado. Este documento formaliza el blueprint arquitectónico post-migración.

## Fase 1: Estructura de Archivos y Directorios (Implementada y Canónica)

Nuestra estructura de archivos se ha solidificado. La decisión de co-localizar los bloques de template dentro de una estructura granular es una mejora clave.

**Estructura Canónica:**