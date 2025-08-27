// .docs/todo.md

# Manifiesto de Tareas y Deuda Técnica de ConvertiKit

Este documento es la Única Fuente de Verdad (SSoT) para el backlog de
refactorizaciones, mejoras y correcciones pendientes.

---

### **ÉPICA 10: Sincronización Definitiva de Contratos y Módulos (Completa)**

- **Estado:** `((Realizada))` ✅
- **Descripción:** Operación de élite para resolver una cascada de 22 errores de compilación mediante la sincronización completa de la arquitectura de módulos, los contratos de tipos, las APIs de componentes y la infraestructura de i18n. Se eliminó la ambigüedad del módulo `sites` y se propagaron las nuevas arquitecturas soberanas y de abstracción.

---

### **ÉPICA 11: Finalización de la Atomización de la Capa de Datos (Prioridad CRÍTICA)**

- **Estado:** `((Pendiente))` ⏳
- **Descripción:** Completar la "Operación de Atomización" de la capa de datos de administración, que fue interrumpida. Esto es esencial para la consistencia arquitectónica de todo el proyecto.
- **Tareas Pendientes:**
  - [ ] **Crear `src/lib/data/admin/campaigns.data.ts`**: ((Pendiente)) Migrar la lógica de campañas del `admin.ts` monolítico.
  - [ ] **Crear `src/lib/data/admin/sites.data.ts`**: ((Pendiente)) Migrar la lógica de sitios del `admin.ts` monolítico.
  - [ ] **Crear `src/lib/data/admin/telemetry.data.ts`**: ((Pendiente)) Migrar la lógica de telemetría del `admin.ts` monolítico.
  - [ ] **Crear `src/lib/data/admin/types.ts`**: ((Pendiente)) Crear la SSoT de tipos para el módulo de administración.
  - [ ] **Crear `src/lib/data/admin/index.ts`**: ((Pendiente)) Crear el manifiesto de módulo que ensamblará la nueva API pública.
  - [ ] **Eliminar `src/lib/data/admin.ts`**: ((Pendiente)) Desmantelar el archivo monolítico una vez que toda su lógica haya sido migrada.

---

### **ÉPICA 12: Propagación de Abstracciones de UI (Prioridad ALTA)**

- **Estado:** `((Pendiente))` ⏳
- **Descripción:** Aplicar las abstracciones de UI de élite creadas (`PaginatedDataTable`, `ResourcePageHeader`) a todos los componentes relevantes para maximizar el cumplimiento del principio DRY y la consistencia visual.
- **Tareas Pendientes:**
  - [ ] **Refactorizar `campaigns-client.tsx`**: ((Vigente)) Refactorizar para que consuma `PaginatedDataTable`.
  - [ ] **Refactorizar `CampaignsPageHeader`**: ((Vigente)) Refactorizar para que consuma `ResourcePageHeader`.
  - [ ] **Refactorizar `UsersPageHeader`**: ((Vigente)) Refactorizar para que consuma `ResourcePageHeader`.

---

### **ÉPICA 13: Refinamiento de Infraestructura de Pruebas (Prioridad ALTA)**

- **Estado:** `((Pendiente))` ⏳
- **Descripción:** Elevar la infraestructura de pruebas a un estándar de producción.
- **Tareas Pendientes:**
  - [ ] **Implementar `globalTeardown` en Playwright**: ((Vigente)) Crear `tests/e2e/global-teardown.ts` para limpiar la base de datos después de la ejecución de la suite E2E.
  - [ ] **Abstraer a Page Object Model (POM)**: ((Vigente)) Refactorizar los arneses de E2E para utilizar clases de "Page Object".
  - [ ] **Crear `SubmitButton` Genérico**: ((Vigente)) Abstraer el patrón de botón de formulario con estado de carga a un componente reutilizable.

---

### **ÉPICA 14: Evolución del Sistema de Permisos y Roles (Prioridad MEDIA)**

- **Estado:** `((Pendiente))` ⏳
- **Descripción:** Expandir y refinar el sistema de permisos para una gestión de acceso más granular y eficiente.
- **Tareas Pendientes:**
  - [ ] **Crear `hasAppPermission`**: ((Vigente)) Implementar una función `hasAppPermission(userId, requiredRoles)` cacheada en `src/lib/data/permissions.ts`.
  - [ ] **Refactorizar Guardianes de Rol**: ((Vigente)) Refactorizar los guardianes (`requireAppRole`) para que consuman la nueva función.

// .docs/todo.md
