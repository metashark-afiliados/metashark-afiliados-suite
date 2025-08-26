// .docs/ROADMAP.md
/**
 * @file .docs/ROADMAP.md
 * @description Manifiesto de Roadmap y Única Fuente de Verdad para el estado de
 *              desarrollo del proyecto ConvertiKit.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
# Roadmap de Desarrollo de Élite: Proyecto ConvertiKit

Este documento audita y rastrea el progreso de las principales iniciativas de desarrollo.

---

### **Épica 1: Fundación y Configuración del Proyecto**

-   **Estado:** `((Realizada))` ✅
-   **Descripción:** Establecimiento de la configuración base del proyecto, incluyendo Next.js, TypeScript, ESLint, Prettier, TailwindCSS y la infraestructura de pruebas.
-   **Aparatos Clave Auditados:**
    -   `package.json`: Sincronizado y con scripts de élite (`gen:*`, `diag:*`).
    -   `next.config.mjs`: Configuración de CSP de élite.
    -   `tsconfig.json`: Rutas de alias (`@/*`) correctamente definidas.
    -   `eslint.config.mjs`: Configuración "Flat" moderna y completa.
    -   `vitest.config.ts`: Suites de pruebas (`unit`, `integration`) segregadas.

---

### **Épica 2: Middleware e Internacionalización (IMAS)**

-   **Estado:** `((Realizada))` ✅
-   **Descripción:** Implementación del pipeline de middleware en el Edge y la estrategia de internacionalización modular atómica (IMAS).
-   **Aparatos Clave Auditados:**
    -   `src/middleware.ts`: Pipeline secuencial asíncrono y robusto.
    -   `src/middleware/handlers/*`: Manejadores atómicos con lógica de negocio aislada.
    -   `src/i18n.ts` y `src/messages/manifest.ts`: Motor de IMAS funcional.
    -   `src/lib/validators/i18n/*`: Contratos de datos de Zod completos.

---

### **Épica 3: Capa de Datos y Acciones del Servidor**

-   **Estado:** `((Realizada))` ✅
-   **Descripción:** Definición del esquema de la base de datos, tipos, y la capa de abstracción de Server Actions para todas las entidades principales.
-   **Aparatos Clave Auditados:**
    -   `db/*`: Scripts SQL idempotentes para el esquema completo.
    -   `src/lib/types/database/*`: Tipos de TypeScript 100% sincronizados con el esquema.
    -   `src/lib/data/*`: Módulos de acceso a datos atómicos con cacheo de `React.cache`.
    -   `src/lib/actions/*`: Server Actions soberanas con validación de permisos y datos.

---

### **Épica 4: UI/UX - Componentes Base y Landing Page**

-   **Estado:** `((Realizada))` ✅
-   **Descripción:** Construcción de todos los componentes de UI atómicos (`/ui`) y el ensamblaje de las páginas públicas, incluyendo la Landing Page.
-   **Aparatos Clave Auditados:**
    -   `src/components/ui/*`: Biblioteca de componentes robusta y accesible.
    -   `src/app/[locale]/page.tsx`: Landing Page ensamblada en el servidor.
    -   `src/components/landing/*`: Componentes de cliente puros y animados.

---

### **Épica 5: UI/UX - Ecosistema del "Workspace Creativo" (Dashboard)**

-   **Estado:** `((Realizada))` ✅
-   **Descripción:** Re-arquitectura completa del área de miembros para implementar el layout de doble barra lateral, la gestión de estado con Zustand y la persistencia de preferencias.
-   **Aparatos Clave Auditados:**
    -   `src/components/layout/dashboard.loader.ts`: Cargador de datos paralelizado y resiliente.
    -   `src/lib/hooks/useDashboardUIStore.ts`: Store de Zustand con persistencia y sincronización multi-pestaña.
    -   `src/components/layout/DashboardLayout.tsx`: Ensamblador de UI de cliente con la nueva arquitectura.
    -   `src/components/layout/sidebar/*`: Componentes de barra lateral soberanos.
    -   `src/components/layout/DashboardHeader.tsx`: Cabecera con `Breadcrumbs`.

---

### **Épica 6: UI/UX - Hub Creativo (Dashboard Principal)**

-   **Estado:** `((Pendiente))` ⏳
-   **Descripción:** Auditar y refactorizar el contenido principal del dashboard (`/dashboard/page.tsx`), incluyendo `WelcomeHero`, `ActionDock` y `RecentActivity`.
-   **Tareas Pendientes:**
    -   Auditoría de `src/app/[locale]/dashboard/dashboard-client.tsx`.
    -   Auditoría de `src/components/dashboard/WelcomeHero.tsx`.
    -   Auditoría de `src/components/dashboard/ActionDock.tsx`.
    -   Auditoría de `src/components/dashboard/RecentActivity.tsx`.

---

### **Épica 7: Infraestructura de Pruebas de Élite**

-   **Estado:** `((Realizada))` ✅
-   **Descripción:** Establecimiento de una infraestructura de pruebas robusta con Vitest, Playwright, MSW y mocks de alta fidelidad.
-   **Aparatos Clave Auditados:**
    -   `tests/config/vitest.setup.ts`: Ciclo de vida de pruebas configurado.
    -   `tests/mocks/*`: Mocks soberanos para dependencias clave (`Supabase`, `next-intl`, `actions`).
    -   `tests/utils/render.tsx`: Arnés de renderizado de máxima fidelidad.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Visión Holística 360°:** Este documento proporciona una visión completa y estructurada del estado del proyecto.
 * =====================================================================
 */
// .docs/ROADMAP.md