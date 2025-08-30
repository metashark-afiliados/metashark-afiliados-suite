// .docs/roadmap/001-DB-REFACTOR-V9.md
/**
 * @file .docs/roadmap/001-DB-REFACTOR-V9.md
 * @description Roadmap de Ejecución y SSoT para la Refactorización Holística de
 *              la Base de Datos a la Arquitectura v9.0.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Roadmap de Tarea: Refactorización Holística de la Base de Datos v9.0

#### **[Objetivo General de la Tarea]**
Evolucionar el esquema de la base de datos para implementar el **Pilar 1: La Base de Datos "Lean"** de la Arquitectura v9.0. Esto implica reemplazar el almacenamiento de strings repetitivos por referencias a "tablas de conversión" (`lookup tables`), optimizando el espacio, el rendimiento y la integridad de los datos.

#### **[Estándares de ÉlITE para esta Tarea]**
1.  **Incremental y No Destructivo:** Todas las modificaciones se realizarán utilizando `CREATE OR REPLACE` para funciones y `ALTER TABLE` para tablas, garantizando cero pérdida de datos.
2.  **Seguridad por Defecto:** Toda nueva tabla nacerá con RLS activado.
3.  **Full Observabilidad:** El script de migración será auto-documentado.
4.  **Consistencia de SSoT:** Los tipos de TypeScript (`/src/lib/types/database/`) serán actualizados para reflejar cada cambio en el esquema.

---

### **Fases Lógicas de Implementación (Secuencial)**

#### **Fase 1: Implementación de `workspace_roles` Lookup Table**

*   **1.1. Crear Tabla `workspace_roles`:**
    *   **Columnas:** `id (SERIAL, PRIMARY KEY)`, `name (TEXT, UNIQUE, NOT NULL)`.
    *   **RLS:** Habilitado por defecto.
    *   **Datos Iniciales:** Poblar con `(1, 'owner')`, `(2, 'admin')`, `(3, 'member')`.
*   **1.2. Refactorizar Tabla `workspace_members`:**
    *   **Acción:** `ALTER TABLE public.workspace_members DROP COLUMN role;`
    *   **Acción:** `ALTER TABLE public.workspace_members ADD COLUMN role_id INTEGER NOT NULL REFERENCES public.workspace_roles(id);`
*   **1.3. Actualizar Tipos de TypeScript:**
    *   **Aparato:** `src/lib/types/database/tables/workspace_members.ts`
    *   **Acción:** Reemplazar `role: Enums["workspace_role"]` por `role_id: number`.
    *   **Aparato:** `src/lib/types/database/enums.ts`
    *   **Acción:** Eliminar el tipo `workspace_role`.

#### **Fase 2: Implementación de `site_statuses` Lookup Table**

*   **2.1. Crear Tabla `site_statuses`:**
    *   **Columnas:** `id (SERIAL, PRIMARY KEY)`, `name (TEXT, UNIQUE, NOT NULL)`.
    *   **RLS:** Habilitado.
    *   **Datos Iniciales:** Poblar con `(1, 'draft')`, `(2, 'published')`, `(3, 'archived')`.
*   **2.2. Refactorizar Tabla `sites`:**
    *   **Acción:** `ALTER TABLE public.sites DROP COLUMN status;`
    *   **Acción:** `ALTER TABLE public.sites ADD COLUMN status_id INTEGER NOT NULL DEFAULT 1 REFERENCES public.site_statuses(id);`
*   **2.3. Actualizar Tipos de TypeScript:**
    *   **Aparato:** `src/lib/types/database/tables/sites.ts`
    *   **Acción:** Reemplazar `status: Enums["site_status"]` por `status_id: number`.
    *   **Aparato:** `src/lib/types/database/enums.ts`
    *   **Acción:** Eliminar el tipo `site_status`.

#### **Fase 3: Implementación de `campaign_statuses` Lookup Table**

*   **3.1. Crear Tabla `campaign_statuses`:**
    *   **Columnas:** `id (SERIAL, PRIMARY KEY)`, `name (TEXT, UNIQUE, NOT NULL)`.
    *   **RLS:** Habilitado.
    *   **Datos Iniciales:** Poblar con `(1, 'draft')`, `(2, 'published')`, `(3, 'archived')`.
*   **3.2. Refactorizar Tabla `campaigns`:**
    *   **Acción:** `ALTER TABLE public.campaigns DROP COLUMN status;`
    *   **Acción:** `ALTER TABLE public.campaigns ADD COLUMN status_id INTEGER NOT NULL DEFAULT 1 REFERENCES public.campaign_statuses(id);`
*   **3.3. Actualizar Tipos de TypeScript:**
    *   **Aparato:** `src/lib/types/database/tables/campaigns.ts`
    *   **Acción:** Reemplazar `status: Enums["campaign_status"]` por `status_id: number`.
    *   **Aparato:** `src/lib/types/database/enums.ts`
    *   **Acción:** Eliminar el tipo `campaign_status`.

#### **Fase 4: Verificación y Cierre**

*   **Acción:** Ejecutar `pnpm db:types:gen` para regenerar los tipos base de Supabase y verificar la consistencia.
*   **Acción:** Ejecutar la suite de pruebas de integración (`pnpm test:integration`) para asegurar que no se hayan introducido regresiones en la lógica de negocio que depende de los roles y estados.

---
