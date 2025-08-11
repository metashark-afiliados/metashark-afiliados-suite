// .docs/LIA_PROTOCOL.md
# PROTOCOLO DE EXCELENCIA Y CONVENCIONES DE L.I.A. LEGACY

**ID del Documento:** LIA-DOC-PROTOCOL-2.0
**Propósito:** Servir como la Única Fuente de Verdad (SSoT) para todas las convenciones, patrones de diseño y decisiones arquitectónicas del proyecto `metashark-afiliados`. Este documento es la guía canónica para la ejecución y el mantenimiento.

---

## 1. Filosofía General (El "Porqué")

1.  **Atomicidad Radical (Filosofía LEGO):** Cada componente, hook, función o acción debe ser una "pieza de Lego": autocontenida, con una única responsabilidad, reutilizable y diseñada para ensamblarse perfectamente con otras.
2.  **Configuración Sobre Código:** La lógica de negocio (reglas de seguridad, listas de navegación, etc.) debe ser declarativa (manifiestos, JSON, objetos de configuración) en lugar de imperativa (código `if/else` anidado).
3.  **Seguridad por Defecto:** El acceso se niega por defecto y se concede explícitamente a través de guardianes de seguridad y políticas RLS.
4.  **Full Observabilidad:** Cada punto de decisión crítico, operación asíncrona o manejo de error en el backend (`Server Actions`, `middleware`, capa de datos) DEBE ser instrumentado con logging estructurado y contextual (`logger.trace`, `info`, `warn`, `error`).
5.  **Internacionalización (i18n) de Élite:** Cero texto codificado en duro. Toda la UI es 100% traducible.

## 2. Convenciones Técnicas Clave

### 2.1. Nomenclatura y Estructura

*   **Archivos y Directorios:** `kebab-case` (ej. `user-permissions.ts`).
*   **Componentes React y Tipos:** `PascalCase` (ej. `LandingHeader`, `ButtonProps`).
*   **Variables y Funciones:** `camelCase` (ej. `createSiteAction`).
*   **Estructura del Proyecto:** Todo el código de la aplicación reside en el directorio `src/`.

### 2.2. Arquitectura de Internacionalización (i18n)

La arquitectura de i18n del proyecto es de **nivel de élite**, diseñada para máxima performance y mantenibilidad:

*   **SSoT de Contrato (Zod):** `src/lib/validators/i18n.schema.ts` es la única fuente de verdad para la estructura de TODOS los mensajes. Esto garantiza la seguridad de tipos y previene la desincronización.
*   **Mensajes Consolidados:** Para cada `locale` soportado (ej. `en-US`), existe un único archivo JSON en `src/messages/` (ej. `en-US.json`). Este archivo contiene TODOS los namespaces de la aplicación.
*   **Carga Dinámica en el Servidor:** El archivo `src/i18n.ts` está configurado para cargar dinámicamente solo el archivo JSON correspondiente al `locale` de la petición actual. Esto minimiza drásticamente las operaciones de I/O del servidor.
*   **Consumo Tipo-Seguro en Cliente:** Los componentes de cliente DEBEN usar el hook `useTypedTranslations` de `src/lib/i18n/hooks.ts`, que proporciona autocompletado y seguridad de tipos en tiempo de compilación para las claves de traducción.

### 2.3. Server Actions (`src/lib/actions/`)

*   **Contrato `ActionResult`:** TODA Server Action debe devolver un objeto de tipo `ActionResult<{ success: boolean; ... }>`.
*   **Seguridad Primero:** La primera operación debe ser la validación de permisos a través de los guardianes de `src/lib/auth/user-permissions.ts`.
*   **Validación de Datos:** La segunda operación debe ser la validación de los datos de entrada (`FormData`) contra un esquema de Zod de `src/lib/validators/`.
*   **Observabilidad y Auditoría:** Todas las mutaciones de datos DEBEN ser registradas con `createAuditLog`.

## 3. Principio de No Regresión

La reconstrucción del proyecto desde el snapshot primitivo sigue una regla estricta: **la nueva versión de un archivo debe contener toda la funcionalidad y exportaciones de la versión anterior, más las mejoras del protocolo de excelencia.** Cualquier eliminación de código debe ser justificada explícitamente como una optimización deliberada, no como una omisión.

---
// .docs/LIA_PROTOCOL.md