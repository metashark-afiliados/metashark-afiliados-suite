// .docs/roadmap/005-DB-REFACTOR-V13-LOOKUPS.md
/**
 * @file .docs/roadmap/005-DB-REFACTOR-V13-LOOKUPS.md
 * @description Roadmap de Ejecución v13.0: Implementación de Tablas de Conversión (Lookup Tables).
 *              Esta es la SSoT para la refactorización holística de la base de datos,
 *              reemplazando los tipos ENUM por tablas de lookup para máxima flexibilidad.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 13.0.0
 */
# Roadmap de Tarea: Refactorización a Tablas de Conversión v13.0

#### **[Objetivo General de la Tarea]**
Reemplazar los tipos `ENUM` de la base de datos (`workspace_role`, `site_status`, `campaign_status`) por tablas de `lookup` dedicadas. Esta refactorización mejorará la flexibilidad del esquema, simplificará la adición de nuevos estados/roles y optimizará el almacenamiento y la indexación.

#### **[ADITIVO: Estandarización del Patrón de Conversión]**
Este patrón de "Tabla de Conversión" se establece como la **SSoT canónica** para cualquier dato categórico y repetitivo en la aplicación. Será implementado de forma aditiva para otros dominios según sea necesario, incluyendo, pero no limitándose a:
- **Códigos de Error:** Como se definió en el Manifiesto v11.0, la tabla `error_codes` es una implementación de este patrón.
- **Tipos de Eventos de Auditoría:** Una futura tabla `audit_event_types`.
- **Tipos de Notificación:** Una futura tabla `notification_types`.

---

### **Fases Lógicas de Implementación (Secuencial)**

#### **Fase 1: Implementación de `workspace_roles` Lookup Table**

*   **1.1. Crear Tabla `workspace_roles`:**
    *   **SQL:** `CREATE TABLE public.workspace_roles (id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL);`
    *   **RLS:** Habilitado por defecto.
*   **1.2. Poblar Tabla `workspace_roles`:**
    *   **SQL:** `INSERT INTO public.workspace_roles (name) VALUES ('owner'), ('admin'), ('member'), ('viewer'), ('billing');`
*   **1.3. Migrar Tabla `workspace_members` (Transaccional):**
    *   **Paso A (Añadir Columna):** `ALTER TABLE public.workspace_members ADD COLUMN role_id INTEGER REFERENCES public.workspace_roles(id);`
    *   **Paso B (Migrar Datos):** `UPDATE public.workspace_members wm SET role_id = wr.id FROM public.workspace_roles wr WHERE wm.role::text = wr.name;`
    *   **Paso C (Eliminar Columna Antigua):** `ALTER TABLE public.workspace_members DROP COLUMN role;`
    *   **Paso D (Aplicar `NOT NULL`):** `ALTER TABLE public.workspace_members ALTER COLUMN role_id SET NOT NULL;`
*   **1.4. Eliminar `ENUM` Obsoleto:**
    *   **SQL:** `DROP TYPE public.workspace_role;`

#### **Fase 2: Implementación de `site_statuses` Lookup Table**

*   **2.1. Crear y Poblar Tabla `site_statuses`:**
    *   **SQL:** `CREATE TABLE public.site_statuses (id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL);`
    *   **SQL:** `INSERT INTO public.site_statuses (name) VALUES ('draft'), ('published'), ('archived');`
*   **2.2. Migrar Tabla `sites` (Transaccional):**
    *   **Paso A:** `ALTER TABLE public.sites ADD COLUMN status_id INTEGER REFERENCES public.site_statuses(id);`
    *   **Paso B:** `UPDATE public.sites s SET status_id = ss.id FROM public.site_statuses ss WHERE s.status::text = ss.name;`
    *   **Paso C:** `ALTER TABLE public.sites DROP COLUMN status;`
    *   **Paso D:** `ALTER TABLE public.sites ALTER COLUMN status_id SET NOT NULL;`
    *   **Paso E:** `ALTER TABLE public.sites ALTER COLUMN status_id SET DEFAULT 1;`
*   **2.3. Eliminar `ENUM` Obsoleto:**
    *   **SQL:** `DROP TYPE public.site_status;`

#### **Fase 3: Implementación de `campaign_statuses` Lookup Table**

*   **3.1. Crear y Poblar Tabla `campaign_statuses`:**
    *   **SQL:** `CREATE TABLE public.campaign_statuses (id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL);`
    *   **SQL:** `INSERT INTO public.campaign_statuses (name) VALUES ('draft'), ('published'), ('archived');`
*   **3.2. Migrar Tabla `campaigns` (Transaccional):**
    *   **Paso A:** `ALTER TABLE public.campaigns ADD COLUMN status_id INTEGER REFERENCES public.campaign_statuses(id);`
    *   **Paso B:** `UPDATE public.campaigns c SET status_id = cs.id FROM public.campaign_statuses cs WHERE c.status::text = cs.name;`
    *   **Paso C:** `ALTER TABLE public.campaigns DROP COLUMN status;`
    *   **Paso D:** `ALTER TABLE public.campaigns ALTER COLUMN status_id SET NOT NULL;`
    *   **Paso E:** `ALTER TABLE public.campaigns ALTER COLUMN status_id SET DEFAULT 1;`
*   **3.3. Eliminar `ENUM` Obsoleto:**
    *   **SQL:** `DROP TYPE public.campaign_status;`

#### **Fase 4: Verificación y Cierre**

*   **Acción:** Ejecutar el roadmap de código paralelo (`002-CODE-REFACTOR-V9.md`) para sincronizar toda la aplicación con este nuevo esquema.
*   **Acción:** Ejecutar la suite de pruebas completa (`pnpm test`) para validar la no regresión.
// .docs/roadmap/005-DB-REFACTOR-V13-LOOKUPS.md