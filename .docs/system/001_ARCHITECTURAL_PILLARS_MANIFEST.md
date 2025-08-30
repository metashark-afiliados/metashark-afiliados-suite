// .docs/system/001_ARCHITECTURAL_PILLARS_MANIFEST.md
/**
 * @file .docs/system/001_ARCHITECTURAL_PILLARS_MANIFEST.md
 * @description Manifiesto Canónico de los Pilares Arquitectónicos de ConvertiKit v1.0.
 *              Esta es la SSoT que describe los principios y la estructura de
 *              la aplicación, sirviendo como guía de referencia para la ingeniería.
 *              Este documento reemplaza a `.docs/system/000_PROJECT_MASTER_MANIFEST_V4.md`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto de Pilares Arquitectónicos de ConvertiKit v1.0

## 1. Filosofía y Visión del Documento
Este manifiesto detalla los pilares arquitectónicos que definen la estructura y el comportamiento de ConvertiKit. Es el resultado de las decisiones registradas en la **Constitución Arquitectónica** (`.docs/000_ARCHITECTURAL_DECISION_LOG.md`) y sirve como la guía de referencia canónica para el desarrollo.

---

## 2. Los Pilares Fundamentales

### **Pilar 1: Arquitectura de Datos y Estado**
*   **Filosofía:** "El Cliente es Soberano del Estado, la Base de Datos es la Guardiana de la Verdad".
*   **Referencia a la Constitución:** AD-002, AD-003.
*   **Capas:**
    1.  **Base de Datos "Lean" (El Guardián - PostgreSQL):** Asegura la integridad y seguridad mediante RLS y `Lookup Tables`.
    2.  **Capa de Datos del Servidor (El Intérprete - `src/lib/data/`):** Única capa que se comunica con la DB, abstrae consultas y enriquece datos.
    3.  **Cliente Inteligente (El Soberano - Zustand):** Gestiona el estado de la UI para una UX instantánea.

### **Pilar 2: Arquitectura de Resiliencia**
*   **Filosofía:** "Persistencia por Defecto, Sincronización Inteligente". El trabajo del usuario nunca se pierde.
*   **Referencia a la Constitución:** AD-003.
*   **Capas:**
    1.  **Defensa Primaria (Local):** `zustand/persist` guarda cada cambio del `BuilderStore` en `localStorage` de forma instantánea.
    2.  **Defensa Secundaria (Nube):** Un hook `useAutoSync` (futuro) sincroniza los cambios a la base de datos de forma `debounced`.

### **Pilar 3: Arquitectura de Server Actions**
*   **Filosofía:** "Lógica de Negocio Pura, Blindada por Defecto".
*   **Referencia a la Constitución:** AD-004.
*   **Ciclo de Vida Canónico:** Un flujo de 5 pasos: Autenticación -> Validación -> Autorización -> Ejecución -> Efectos Secundarios.
*   **Atomicidad:** Operaciones con más de una escritura **DEBEN** ser una RPC de PostgreSQL para garantizar transacciones atómicas.

### **Pilar 4: Arquitectura de Observabilidad**
*   **Filosofía:** "Visibilidad Total, Cero Puntos Ciegos".
*   **Referencia a la Constitución:** AD-004, AD-005.
*   **Capas:**
    1.  **Logging (`src/lib/logging.ts`):** Loggers desacoplados para cliente y servidor, con integración a Sentry.
    2.  **Telemetría (`visitor_logs`):** Tracking de sesión y enriquecimiento de datos del cliente.
    3.  **Auditoría (`audit_logs`):** Registro inmutable de todas las mutaciones de datos críticas.
    4.  **Monitoreo de Errores (`system_errors` & Sentry):** Doble capa de registro de errores.

### **Pilar 5: Arquitectura de Errores Soberanos Codificados**
*   **Filosofía:** "Cero Strings Mágicos, Trazabilidad Total".
*   **Referencia a la Constitución:** AD-004.
*   **Implementación:**
    1.  Las Server Actions devuelven `error_code`s.
    2.  La UI utiliza estos códigos para buscar el mensaje traducido desde la SSoT de errores (`ValidationErrors.json`), que es validada por los schemas Zod atómicos.
    3.  Los `error_code`s se registran en los logs para una trazabilidad perfecta.

### **Pilar 6: Arquitectura de UI y Personalización**
*   **Filosofía:** "Personalización Soberana" y "Calma Enfocada".
*   **Referencia a la Constitución:** AD-005.
*   **Capas:**
    1.  **SSoT de Tokens (Variables CSS - `globals.css`):** Define todos los tokens de diseño (`--primary`, `--radius`).
    2.  **Consumo de Tokens (Tailwind CSS):** Los componentes de UI consumen estas variables CSS.
    3.  **Intercambiabilidad de Iconos (Inyección de Dependencias):** Un `IconLibraryProvider` inyecta la librería de iconos activa a través de un `Context`.

### **Pilar 7: Arquitectura de Internacionalización (IMAS)**
*   **Filosofía:** "Construir Contratos, No Redefinirlos".
*   **Referencia a la Constitución:** AD-004, AD-005.
*   **Capas:**
    1.  **Contenido Atómico (`src/messages/`):** Archivos `.json` por dominio.
    2.  **Contratos Atómicos (`src/lib/validators/i18n/`):** Schemas de Zod que validan cada `.json`.
    3.  **Ensamblaje por Composición:** Schemas de nivel superior importan y fusionan (`.merge()`) los schemas de los componentes que utilizan.

### **Pilar de Metodología: Sistema Espejo**
*   **Filosofía:** "El Código es un Reflejo del Diseño, las Pruebas son un Reflejo del Código".
*   **Referencia a la Constitución:** AD-001.
*   **Implementación:** Estructura de directorios espejada entre `.docs/espejo/`, `src/` y `tests/`.
// .docs/system/001_ARCHITECTURAL_PILLARS_MANIFEST.md