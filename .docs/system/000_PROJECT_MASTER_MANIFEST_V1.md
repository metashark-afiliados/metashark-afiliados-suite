// .docs/system/000_PROJECT_MASTER_MANIFEST.md
/\*\*

- @file .docs/system/000_PROJECT_MASTER_MANIFEST.md
- @description Manifiesto Maestro del Proyecto y Bitácora de Decisiones Arquitectónicas v3.0.
-              Esta es la Única Fuente de Verdad (SSoT) que registra las decisiones
-              arquitectónicas globales y sirve como contenedor para los manifiestos
-              funcionales detallados de cada dominio de negocio.
- @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
- @version 3.0.0
  \*/

# Manifiesto Maestro y Bitácora Arquitectónica de ConvertiKit v3.0

## 1. Filosofía del Documento

Este documento es un registro vivo y aditivo. Su propósito es doble:

1.  **Registrar Decisiones Arquitectónicas Globales:** Capturar las directivas transversales que rigen todo el sistema.
2.  **Servir como Manifiesto Maestro:** Contener los manifiestos funcionales detallados para cada dominio de negocio, estableciendo un formato canónico para la documentación de funcionalidades.

---

## 2. Registro de Decisiones Arquitectónicas Globales (AD-G)

### **AD-G-001: Adopción de la Arquitectura de "Errores Soberanos Codificados"**

- **Decisión:** Se abandona el patrón de devolver `string`s de error. Las Server Actions devuelven `error_code`s, mapeados a mensajes de i18n en el cliente a través de una `lookup table` (`error_codes`) y `ValidationErrors.json`.
- **Justificación:** Desacoplamiento total, mantenibilidad centralizada y consistencia.

### **AD-G-002: Reemplazo de `ENUM`s por `Lookup Tables`**

- **Decisión:** Los tipos `ENUM` de PostgreSQL para datos categóricos (`workspace_role`) serán reemplazados por tablas de `lookup` dedicadas con claves foráneas.
- **Justificación:** Flexibilidad para añadir nuevos valores sin migraciones de esquema (`ALTER TYPE`), extensibilidad y mejor rendimiento.

### **AD-G-003: Implementación de la Estrategia "Hyper-Resilient Smart Client"**

- **Decisión:** El estado de la UI persistirá en `localStorage` (defensa primaria) y se sincronizará automáticamente con la base de datos de forma inteligente y `debounced` (defensa secundaria).
- **Justificación:** UX offline-first, cero pérdida de datos del usuario, y reducción masiva de la carga en la base de datos.

---

## 3. Manifiestos Funcionales por Dominio (AD-F)

A continuación se presentan los manifiestos detallados para cada dominio funcional. Este formato es la plantilla canónica.

### **AD-F-001: Dominio "Workspaces"**

#### **3.1.1. Rol Estratégico y Propósito de Negocio**

El dominio `Workspaces` es el **pilar de la arquitectura multi-tenant y colaborativa**. Proporciona un contenedor aislado y seguro para que los equipos organicen sus activos (`Sites`, `Creations`), gestionen permisos y colaboren. Estratégicamente, habilita el modelo de negocio B2B y de agencias.

#### **3.1.2. Arquitectura Técnica y de Datos**

- **SSoT de Datos:** Tablas `workspaces`, `workspace_members`, `invitations`.
- **Diagrama de Entidad-Relación:**
  ```mermaid
  erDiagram
      profiles ||--|{ workspace_members : "es miembro de"
      workspaces ||--|{ workspace_members : "tiene"
      workspaces ||--|{ invitations : "tiene"
      workspaces ||--o{ sites : "contiene"
  ```
- **Arquitectura de Componentes:** La lógica de UI está encapsulada en el `WorkspaceSwitcher` y sus componentes hijos, orquestados por el hook soberano `useWorkspaceManager`.

#### **3.1.3. Flujos de Lógica de Negocio (Server Actions)**

- **SSoT de Lógica:** `src/lib/actions/workspaces.actions.ts`.
- **Flujos Críticos:**
  1.  **Selección de Contexto (`setActiveWorkspaceAction`):** Establece una cookie `httpOnly` (`active_workspace_id`) que define el contexto operativo del usuario para toda la sesión.
  2.  **Creación de Workspace (`createWorkspaceAction`):** Implementado como una RPC transaccional que inserta en `workspaces` y `workspace_members` (asignando el rol de `owner`), garantizando la atomicidad.
  3.  **Invitación de Miembro (`sendWorkspaceInvitationAction`):** Valida los permisos del invitador (`owner`/`admin`) y crea un registro `pending` en la tabla `invitations`.

#### **3.1.4. Roadmap de Evolución del Dominio**

- **Completado:** CRUD básico, sistema de roles extensible, sistema de invitaciones, persistencia de contexto.
- **Próximos Pasos (Vigente):** Transferencia de Propiedad, Página de Ajustes de Workspace, Integración con Facturación.

// .docs/system/000_PROJECT_MASTER_MANIFEST.md
