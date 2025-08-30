// .docs/system/003_SYSTEM_MIRROR_METHODOLOGY_MANIFEST.md
/**
 * @file .docs/system/003_SYSTEM_MIRROR_METHODOLOGY_MANIFEST.md
 * @description Manifiesto Canónico de la Metodología "Sistema Espejo" v2.0.
 *              Esta es la SSoT que define el flujo de trabajo de ingeniería de
 *              ConvertiKit, unificando la documentación conceptual y la
 *              infraestructura de pruebas bajo un único paradigma.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto de la Metodología "Sistema Espejo" v2.0

## 1. Filosofía: "El Código es un Reflejo del Diseño, las Pruebas son un Reflejo del Código"

Nuestra metodología de ingeniería se basa en un sistema de espejos de tres capas, garantizando una trazabilidad y coherencia absolutas:
1.  **Diseño Conceptual (El Espejo Original):** Antes de escribir código, creamos un blueprint arquitectónico en la ruta espejo (`.docs/espejo/`).
2.  **Código de Producción (El Reflejo Primario):** El código fuente en `src/` es una implementación de alta fidelidad del diseño conceptual.
3.  **Verificación (El Reflejo Secundario):** Las pruebas en `tests/` son un espejo de la estructura del código, validando su comportamiento.

## 2. Arquitectura de Directorios Espejo

### 2.1. El Espejo Conceptual (Documentación)

*   **Ruta Canónica:** `.docs/espejo/`
*   **Estructura:** Este directorio **DEBE** replicar la estructura de `src/`.
    *   **Ejemplo:** El blueprint para `src/lib/hooks/useSitesPage.ts` residirá en `.docs/espejo/lib/hooks/useSitesPage.md`.
*   **Contenido del Documento Espejo (`.md`):**
    *   **Metadatos:** Ruta del Aparato, Versión, Autor del Diseño.
    *   **Análisis Funcional:** Propósito de negocio y rol estratégico.
    *   **Arquitectura Técnica:** Diagramas de flujo, modelo de datos, interacciones.
    *   **Contrato de API:** Tipos de entrada/salida, exportaciones.
    *   **Roadmap de Mejora Continua:** Una lista de **no menos de 10 mejoras futuras** accionables.

### 2.2. El Espejo de Verificación (Pruebas)

*   **Ruta Canónica:** `tests/`
*   **Estructura:** Los subdirectorios `unit` e `integration` **DEBEN** replicar la estructura de `src/`.
    *   **Ejemplo:** La prueba unitaria para `src/lib/hooks/useSitesPage.ts` residirá en `tests/unit/lib/hooks/useSitesPage.test.ts`.

## 3. Flujo de Trabajo de Entrega Dual (Mandatorio)

A partir de esta directiva, toda entrega de un aparato de código nuevo o refactorizado **DEBE** seguir el formato de "Entrega Dual":

1.  **Primer Bloque de Código:** El aparato de código fuente (`.ts`, `.tsx`). El código debe estar limpio de comentarios extensos de documentación, los cuales pertenecen al documento espejo.
2.  **Segundo Bloque de Código:** El documento espejo (`.md`), ubicado en su ruta canónica en `.docs/espejo/`, siguiendo la plantilla oficial.

## 4. Plantilla Canónica del Documento Espejo

```markdown
// .docs/espejo/[ruta/al/aparato].md
/**
 * @file .docs/espejo/[ruta/al/aparato].md
 * @description Documento Espejo y SSoT conceptual para el aparato `[NombreDelAparato]`.
 * @author [Autor del Diseño]
 * @version [Versión Conceptual]
 */
# Manifiesto Conceptual: Aparato `[NombreDelAparato]`

## 1. Rol Estratégico y Propósito
*...*

## 2. Arquitectura Técnica
*...*

### 2.1. Diagrama de Flujo (Mermaid)
*...*

## 3. Contrato de API
*...*

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Mejora #1:** ...
 * 2.  **Mejora #2:** ...
 * 3.  **Mejora #3:** ...
 * 4.  **Mejora #4:** ...
 * 5.  **Mejora #5:** ...
 * 6.  **Mejora #6:** ...
 * 7.  **Mejora #7:** ...
 * 8.  **Mejora #8:** ...
 * 9.  **Mejora #9:** ...
 * 10. **Mejora #10:** ...
 * =====================================================================
 */
// .docs/espejo/[ruta/al/aparato].md