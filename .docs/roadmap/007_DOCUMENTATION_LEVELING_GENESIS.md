// .docs/roadmap/007_DOCUMENTATION_LEVELING_GENESIS.md
/**
 * @file .docs/roadmap/007_DOCUMENTATION_LEVELING_GENESIS.md
 * @description Roadmap de Ejecución "Génesis": Nivelación de la SSoT Documental.
 *              Esta es la hoja de ruta para la creación de todos los documentos
 *              espejo faltantes, alcanzando el 100% de cumplimiento con la
 *              Metodología "Sistema Espejo".
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Roadmap de Tarea: Nivelación Documental "Génesis" v1.0

### **Objetivo General:**
Crear un documento espejo (`.docs/espejo/**/*.md`) para cada aparato de código significativo en `src/`, siguiendo la Metodología Sistema Espejo (AD-001).

---

### **Fase 1: Blindaje del Núcleo Lógico (`src/lib/`)**

#### **Tarea 1.1: Documentación de la Capa de Acciones (`/lib/actions/`)**
*   **Aparatos a Documentar:**
    *   `src/lib/actions/admin.actions.ts`
    *   `src/lib/actions/auth.actions.ts`
    *   `src/lib/actions/builder.actions.ts`
    *   ... (y todos los demás módulos de acción)

#### **Tarea 1.2: Documentación de la Capa de Datos (`/lib/data/`)**
*   **Aparatos a Documentar:**
    *   `src/lib/data/admin/users.data.ts`
    *   `src/lib/data/campaigns/management.data.ts`
    *   ... (y todos los demás módulos de datos)

#### **Tarea 1.3: Documentación de Hooks Soberanos (`/lib/hooks/`)**
*   **Aparatos a Documentar:**
    *   `src/lib/hooks/useSitesPage.ts`
    *   `src/lib/hooks/useWorkspaceManager.ts`
    *   `src/lib/hooks/ui/useUrlStateSync.ts`
    *   ... (y todos los demás hooks)

---

### **Fase 2: Solidificación de la Fundación de UI (`/components/ui/` y `/shared/`)**

#### **Tarea 2.1: Documentación de Átomos de UI (`/components/ui/`)**
*   **Aparatos a Documentar (Ejemplos Prioritarios):**
    *   `src/components/ui/button/Button.tsx`
    *   `src/components/ui/input.tsx`
    *   `src/components/ui/card.tsx`
    *   `src/components/ui/dialog.tsx`

#### **Tarea 2.2: Documentación de Componentes Compartidos (`/components/shared/`)**
*   **Aparatos a Documentar:**
    *   `src/components/shared/PaginatedDataTable.tsx`
    *   `src/components/shared/ResourcePageHeader.tsx`
    *   ... (y los demás)

---

### **Fase 3: Clarificación de Dominios de UI (`/components/[dominio]/`)**
*   **Objetivo:** Documentar los componentes de ensamblaje de mayor nivel. Esta fase se abordará una vez que las capas de lógica y UI base estén completas.
// .docs/roadmap/007_DOCUMENTATION_LEVELING_GENESIS.md