// .docs/000_ARCHITECTURAL_DECISION_LOG.md
/**
 * @file .docs/000_ARCHITECTURAL_DECISION_LOG.md
 * @description La Constitución Arquitectónica de ConvertiKit v2.0.
 *              Esta es la Única Fuente de Verdad Maestra (SSoT Maestra) que registra
 *              y justifica las decisiones de arquitectura y diseño para el proyecto.
 *              Es un documento aditivo e inmutable que sirve como memoria del proyecto.
 *              Este documento consolida y reemplaza todas las versiones anteriores de
 *              manifiestos maestros y logs de decisión.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# La Constitución Arquitectónica de ConvertiKit v2.0

## 1. Filosofía y Visión

Este documento es un registro cronológico y aditivo. Su propósito no es planificar el futuro, sino **documentar el presente y el pasado** para informar el futuro. Cada entrada (AD) captura una decisión clave, su contexto, sus consecuencias y la justificación técnica que la respalda, sirviendo como la SSoT Maestra para toda la ingeniería.

---

## 2. Registro de Decisiones Arquitectónicas (ADs)

### **AD-001: Adopción de la Metodología "Sistema Espejo"**
*   **Fecha:** 2025-08-30
*   **Decisión:** Se establece la metodología de ingeniería "Sistema Espejo" como el flujo de trabajo canónico. La estructura de directorios de `.docs/espejo/` (diseño conceptual), `src/` (código de producción) y `tests/` (verificación) deben ser un reflejo una de la otra. Toda entrega de un aparato debe ser una **"Entrega Dual"**: el documento espejo (`.md`) y el aparato de código (`.ts`/`.tsx`).
*   **Justificación:** Garantiza una trazabilidad y coherencia absolutas entre el diseño, la implementación y la validación.
*   **Fuente Original:** `.docs/system/003_SYSTEM_MIRROR_METHODOLOGY_MANIFEST.md`

### **AD-002: Reemplazo de `ENUM`s por `Lookup Tables`**
*   **Fecha:** 2025-08-30
*   **Decisión:** Todos los tipos `ENUM` de PostgreSQL para datos categóricos (`workspace_role`, `site_status`) serán reemplazados por tablas de `lookup` dedicadas con claves foráneas. Este patrón se establece como la SSoT para cualquier dato categórico.
*   **Justificación:** Aumenta la flexibilidad (añadir nuevos valores es un `INSERT`, no una migración `ALTER TYPE`), mejora la extensibilidad y optimiza el rendimiento de la indexación.
*   **Fuente Original:** `.docs/roadmap/005-DB-REFACTOR-V13-LOOKUPS.md`

### **AD-003: Implementación de la Estrategia "Hyper-Resilient Smart Client"**
*   **Fecha:** 2025-08-30
*   **Decisión:** El estado de la UI (especialmente en el Builder) persistirá en `localStorage` (defensa primaria) y se sincronizará automáticamente con la base de datos de forma inteligente y `debounced` (defensa secundaria), utilizando `zustand` y sus middlewares.
*   **Justificación:** Proporciona una UX offline-first, garantiza cero pérdida de datos del usuario y reduce drásticamente la carga en la base de datos.
*   **Fuente Original:** `.docs/espejo/architecture/DATA_STRATEGY_V10.md`

### **AD-004: Adopción de la Arquitectura de "Errores Soberanos Codificados"**
*   **Fecha:** 2025-08-30
*   **Decisión:** Se abandona el patrón de devolver `string`s de error literales desde las Server Actions. En su lugar, las acciones devolverán `error_code`s. Una SSoT de errores (schemas Zod atómicos en `src/lib/validators/i18n/errors/` y sus correspondientes JSONs en `src/messages/shared/errors/`) servirá como la matriz de conversión para la UI, el logging y la observabilidad.
*   **Justificación:** Desacoplamiento total entre la lógica de negocio y la presentación. Mantenibilidad centralizada, trazabilidad absoluta de errores y consistencia en el feedback al usuario y en los logs.
*   **Fuente Original:** `.docs/espejo/validators/ERROR_HANDLING_MANIFESTO_v2.md`

### **AD-005: Estandarización de Manifiestos Documentales en `.docs`**
*   **Fecha:** 2025-08-30
*   **Decisión:** Toda la documentación conceptual y arquitectónica se consolida en manifiestos canónicos dentro del directorio `.docs`. Se establece un sistema de numeración y una estructura jerárquica (`system/`, `functionality/`, `espejo/`) para crear un índice ordenado y lógico del conocimiento del proyecto. Este documento (`000_ARCHITECTURAL_DECISION_LOG.md`) es la raíz de dicha SSoT.
*   **Justificación:** Crea una única fuente de verdad para la arquitectura, eliminando la ambigüedad, el riesgo de consultar documentos obsoletos y acelerando el onboarding de nuevos miembros al equipo.
*   **Fuente Original:** Decisión de esta refactorización, basada en la auditoría del snapshot.
// .docs/000_ARCHITECTURAL_DECISION_LOG.md