// .docs/system/000_PROJECT_MASTER_MANIFEST_V4.md
/**
 * @file .docs/system/000_PROJECT_MASTER_MANIFEST_V4.md
 * @description Manifiesto Maestro del Proyecto y Bitácora de Decisiones Arquitectónicas v4.0.
 *              Esta es la SSoT definitiva que unifica todas las directivas de
 *              arquitectura y diseño de ConvertiKit.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 4.0.0
 */
# Manifiesto Maestro y Bitácora Arquitectónica de ConvertiKit v4.0

## 1. Filosofía y Visión del Documento

Este manifiesto es el **System Prompt canónico del proyecto**. Es un registro aditivo que consolida todas las decisiones de alto nivel y define los pilares arquitectónicos. Actúa como la constitución para todo el desarrollo futuro.

---

## 2. Pilares Arquitectónicos Fundamentales

### **Pilar 1: Arquitectura de Datos y Estado**

*   **Filosofía:** "El Cliente es Soberano del Estado, la Base de Datos es la Guardiana de la Verdad".
*   **Capas:**
    1.  **Base de Datos "Lean" (El Guardián - PostgreSQL):**
        *   **Seguridad por Defecto:** RLS en todas las tablas.
        *   **Integridad Absoluta:** Uso de `lookup tables` en lugar de `ENUM`s.
        *   **Rendimiento:** Indexación estratégica y RPCs para transacciones atómicas.
    2.  **Capa de Datos del Servidor (El Intérprete - `src/lib/data/`):**
        *   Única capa que se comunica con la DB.
        *   Abstrae y enriquece las consultas.
        *   Utiliza `unstable_cache` de Next.js para optimizar lecturas.
    3.  **Cliente Inteligente (El Soberano - Zustand):**
        *   El estado de la UI reside en el cliente para una UX instantánea.
        *   Ver **Pilar 2: Arquitectura de Resiliencia** para más detalles.

### **Pilar 2: Arquitectura de Resiliencia**

*   **Filosofía:** "Persistencia por Defecto, Sincronización Inteligente". El trabajo del usuario nunca se pierde.
*   **Capas:**
    1.  **Defensa Primaria (Local):** El middleware `persist` de Zustand guarda cada cambio del `BuilderStore` en `localStorage` de forma instantánea.
    2.  **Defensa Secundaria (Nube):** Un hook `useAutoSync` (futuro) sincronizará los cambios a la base de datos de forma `debounced` y en eventos clave (`beforeunload`), minimizando la carga del servidor.

### **Pilar 3: Arquitectura de Server Actions**

*   **Filosofía:** "Lógica de Negocio Pura, Blindada por Defecto".
*   **Ciclo de Vida Canónico:**
    1.  **Autenticación:** `getAuthenticatedUser()`.
    2.  **Validación:** Schema de Zod.
    3.  **Autorización:** Guardianes de permisos (`requireWorkspacePermission`).
    4.  **Ejecución:** Lógica de negocio en `try/catch`.
    5.  **Efectos Secundarios:** Auditoría, revalidación de caché y retorno de `ActionResult`.
*   **Atomicidad:** Operaciones con más de una escritura **DEBEN** ser una RPC de PostgreSQL.

### **Pilar 4: Arquitectura de Observabilidad**

*   **Filosofía:** "Visibilidad Total, Cero Puntos Ciegos".
*   **Capas:**
    1.  **Logging (`src/lib/logging.ts`):** `logger` para servidor (integrado con Sentry) y `clientLogger` para navegador.
    2.  **Telemetría (`visitor_logs`):** Tracking de sesión y enriquecimiento de datos del cliente.
    3.  **Auditoría (`audit_logs`):** Registro inmutable de todas las mutaciones de datos críticas.
    4.  **Monitoreo de Errores (`system_errors` & Sentry):** Doble capa de registro de errores (interno y externo).

### **Pilar 5: Arquitectura de Errores Soberanos Codificados**

*   **Filosofía:** "Cero Strings Mágicos, Trazabilidad Total".
*   **Implementación:**
    1.  Las Server Actions devuelven `error_code`s.
    2.  La UI utiliza estos códigos para buscar el mensaje traducido desde `ValidationErrors.json`, que es validado por `ValidationErrors.schema.ts`.
    3.  Los `error_code`s se registran en los logs para una trazabilidad perfecta.
### **Pilar 6: Arquitectura de UI y Personalización ("Calma Enfocada")**

*   **Filosofía:** "Personalización Soberana". La UI de `ConvertiKit` es un camaleón, adaptable a múltiples temas y agnóstica a librerías específicas.
*   **Capas:**
    1.  **SSoT de Tokens de Diseño (Variables CSS - `globals.css`):**
        *   Define todos los tokens de diseño (`--primary`, `--radius`, etc.).
        *   Temas (ej. `.dark`, `.light`) se definen simplemente sobrescribiendo estas variables.
        *   El `ThemeProvider` de `next-themes` aplica la clase de tema al `<html>`.
    2.  **Consumo de Tokens (Tailwind CSS):**
        *   `tailwind.config.mjs` y los componentes de UI (`shadcn/ui`) consumen estas variables CSS, propagando los cambios de tema automáticamente.
    3.  **Intercambiabilidad de Iconos (Inyección de Dependencias):**
        *   Un manifiesto (`icon-libraries.config.ts`) define las librerías soportadas.
        *   Un `IconLibraryProvider` (`React.Context`) lee la preferencia del usuario, carga dinámicamente la librería y la inyecta a toda la aplicación.
        *   El componente `DynamicIcon` consume el contexto y renderiza el icono correcto.

### **Pilar 7: Arquitectura de Internacionalización (IMAS)**

*   **Filosofía:** "Construir Contratos, No Redefinirlos". Un componente consume los mensajes de su dominio, pero no redefine los de otros.
*   **Capas:**
    1.  **Contenido Atómico (`src/messages/`):** Archivos `.json` por dominio/componente.
    2.  **Contratos de Datos Atómicos (`src/lib/validators/i18n/`):** Schemas de Zod que validan la estructura de cada archivo `.json`.
    3.  **Ensamblaje por Composición:** Schemas de nivel de página (ej. `SitesPage.schema.ts`) **DEBEN** importar y fusionar (`.merge()`) los schemas de los componentes que utilizan, adhiriéndose al principio DRY.

### **Pilar 8: Metodología de Ingeniería ("Sistema Espejo")**

*   **Filosofía:** "El Código es un Reflejo del Diseño, las Pruebas son un Reflejo del Código".
*   **Capas del Espejo:**
    1.  **Diseño Conceptual (`.docs/espejo/`):** Replicando la estructura de `src/`, aquí se crean los blueprints arquitectónicos antes de la implementación.
    2.  **Código de Producción (`src/`):** La implementación de alta fidelidad del diseño.
    3.  **Verificación (`tests/`):** Replicando la estructura de `src/`, aquí residen las pruebas que validan el comportamiento del código.
*   **Flujo de Entrega:** Cada entrega debe ser una **"Entrega Dual"**: el documento espejo (`.md`) y el aparato de código (`.ts`/`.tsx`).

---