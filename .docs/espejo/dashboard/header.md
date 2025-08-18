// .docs/espejo/dashboard/header.md
/**
 * @file .docs/espejo/dashboard/header.md
 * @description Blueprint Arquitectónico de Élite para `DashboardHeader` v2.0.
 *              Define el re-propósito del componente a un "Encabezado Contextual",
 *              alineado con la arquitectura del Workspace Creativo v9.1.
 * @author Raz Podestá
 * @version 9.1.0
 */
# Blueprint: `src/components/layout/DashboardHeader.tsx` - El Encabezado Contextual

#### **[Tipo de Aparato]**
Orquestador de UI de Cliente (Client Component) - Componente de Presentación Puro.

#### **[Filosofía de Diseño y Propósito]**
La misión del `DashboardHeader` v2.0 es proporcionar **conciencia situacional y acceso a acciones relevantes**. Abandona su rol como contenedor de navegación global para convertirse en un componente dinámico cuyo contenido es dictado por la página que lo renderiza.

Su filosofía es "Información y Acción en Contexto". Muestra dónde está el usuario (`Breadcrumbs`) y qué puede hacer (`Botones de Acción`), adaptándose a cada vista del dashboard.

#### **[Análisis del Estado Anterior (Deuda Técnica)]**
La versión anterior era un componente estático que contenía el `WorkspaceSwitcher` y acciones globales. Esto creaba una sobrecarga de información irrelevante en ciertas vistas y carecía de flexibilidad.

#### **[Arquitectura Propuesta (El Estado de Élite)]**
El `DashboardHeader` será un componente de presentación 100% puro y controlado por props. Su estructura interna será un `header` con `flex justify-between`.

**Contrato de Props (`DashboardHeaderProps`):**
```typescript
interface DashboardHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    icon: React.ElementType;
    onClick: () => void;
  };
  secondaryActions?: React.ReactNode; // Permite pasar botones o menús complejos
}
Componentes Internos:
Breadcrumbs (Izquierda): Un nuevo componente atómico que renderizará la lista de breadcrumbs pasados por props.
Título y Subtítulo (Izquierda, debajo de Breadcrumbs): Renderiza el title y subtitle.
Acciones (Derecha): Un div que renderizará condicionalmente el primaryAction (como un <Button>) y cualquier secondaryActions (ej. <ThemeSwitcher>, <InvitationBell>).
Diagrama de Flujo (Mermaid):
code
Mermaid
graph TD
    A[Página Consumidora (ej. /dashboard/sites)] -- Construye Props --> B(DashboardHeaderProps);
    B -- Pasa a --> C{DashboardHeader};
    C -- Renderiza --> D(Breadcrumbs);
    C -- Renderiza --> E(Título / Subtítulo);
    C -- Renderiza --> F(Botón de Acción Primaria);
    C -- Renderiza --> G(Acciones Secundarias);
[Contrato de Interacción y Dependencias]
Exportaciones: export function DashboardHeader.
Importaciones Clave: Breadcrumbs (nuevo), Button.
Impacto Sistémico:
Todas las páginas del dashboard (/dashboard, /dashboard/sites, etc.) ahora serán responsables de importar y renderizar este componente, pasándole las props contextuales correctas.
El DashboardLayout ya no lo renderizará.
Se deberá crear el nuevo componente atómico Breadcrumbs.tsx.
[Estrategia de Pruebas]
Prueba Unitaria (Vitest):
Renderizar el componente con un conjunto completo de props y verificar que todos los elementos (breadcrumbs, título, botones) se muestren correctamente.
Renderizar sin props opcionales (subtitle, primaryAction) y verificar que no se rendericen.
Simular un clic en el botón de acción primaria y verificar que el onClick callback sea invocado.
// .docs/espejo/dashboard/header.md