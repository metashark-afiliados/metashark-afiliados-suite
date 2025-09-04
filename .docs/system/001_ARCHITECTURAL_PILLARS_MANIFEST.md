// .docs/system/001_ARCHITECTURAL_PILLARS_MANIFEST.md
/**
 * @file .docs/system/001_ARCHITECTURAL_PILLARS_MANIFEST.md
 * @description Manifiesto Canónico de los Pilares Arquitectónicos de ConvertiKit v2.0.
 *              Esta es la SSoT que describe los principios y la estructura de
 *              la aplicación. Ha sido refactorizado para alinear su contenido con
 *              los manifiestos de dominio atómicos y detallados.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto de Pilares Arquitectónicos de ConvertiKit v2.0

## 1. Filosofía y Visión del Documento
Este manifiesto detalla los pilares arquitectónicos que definen la estructura y el comportamiento de ConvertiKit. Sirve como la guía de referencia canónica de alto nivel. Para detalles de implementación de cada pilar, se debe consultar el manifiesto de sistema específico referenciado.

---

## 2. Los Pilares Fundamentales

### **Pilar 1: Arquitectura de Datos y Estado**
*   **Filosofía:** "El Cliente es Soberano del Estado, la Base de Datos es la Guardiana de la Verdad".
*   **SSoT Detallada:** `.docs/system/005_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md`
*   **Resumen:** Una arquitectura de tres capas que desacopla la Base de Datos "Lean" (PostgreSQL), la Capa de Datos del Servidor (abstracción de consultas) y el Cliente Inteligente (Zustand para estado de UI).

### **Pilar 2: Arquitectura de Server Actions**
*   **Filosofía:** "Lógica de Negocio Pura, Blindada por Defecto".
*   **SSoT Detallada:** `.docs/system/004_SERVER_ACTIONS_ARCHITECTURE_MANIFEST.md`
*   **Resumen:** Un ciclo de vida canónico de 5 pasos (Autenticación, Validación, Autorización, Ejecución, Efectos Secundarios) con un mandato estricto de usar RPCs de PostgreSQL para operaciones transaccionales.

### **Pilar 3: Arquitectura de Internacionalización (IMAS)**
*   **Filosofía:** "Construir Contratos, No Redefinirlos".
*   **SSoT Detallada:** `.docs/system/007_I18N_ARCHITECTURE_MANIFEST.md`
*   **Resumen:** La estrategia IMAS (Internationalization Modular Atomic Strategy) se basa en la composición de contratos de datos (Schemas Zod) que validan manifiestos de contenido (`.json`) atómicos.

### **Pilar 4: Arquitectura de Observabilidad Holística**
*   **Filosofía:** "Visibilidad Total, Cero Puntos Ciegos".
*   **SSoT Detallada:** `.docs/system/003_OBSERVABILITY_MANIFEST.md`
*   **Resumen:** Una estrategia de observabilidad de extremo a extremo que incluye:
    1.  **Logging Estructurado:** `pino` emitiendo JSON a `stdout` para ingesta agnóstica.
    2.  **Banco de Errores Soberano:** Persistencia de errores críticos en la tabla `system_errors`.
    3.  **Auditoría Inmutable:** Registro de todas las mutaciones de datos significativas en `audit_logs`.
    4.  **Telemetría de Comportamiento:** Seguimiento del ciclo de vida del usuario en `visitor_logs`.

### **Pilar de Metodología: Sistema Espejo**
*   **Filosofía:** "El Código es un Reflejo del Diseño, las Pruebas son un Reflejo del Código".
*   **Referencia a la Constitución:** AD-001.
*   **Implementación:** Estructura de directorios espejada entre `.docs-espejo/`, `src/` y `tests/`.
// .docs/system/001_ARCHITECTURAL_PILLARS_MANIFEST.md