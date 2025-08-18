// .docs/espejo/dashboard/page.md
/**
 * @file .docs/espejo/dashboard/page.md
 * @description Blueprint Arquitectónico de Élite para la página principal del Dashboard (`/dashboard`).
 *              Define la estructura y composición de la nueva experiencia de bienvenida,
 *              inspirada en Canva y CapCut.
 * @author Raz Podestá
 * @version 9.1.0
 */
# Blueprint: `src/app/[locale]/dashboard/page.tsx` - El Hub de Bienvenida

#### **[Tipo de Aparato]**
Orquestador de Página de Servidor (Server Component).

#### **[Filosofía de Diseño y Propósito]**
La misión de esta página es ser el **punto de partida contextual y orientado a la acción** del usuario. Su filosofía es "Bienvenida Personalizada, Lanzamiento Rápido". Debe recibir al usuario por su nombre, confirmar su contexto de trabajo (workspace) y presentar de forma clara las acciones más probables y su actividad reciente. Elimina la ambigüedad y guía al usuario hacia la productividad inmediata.

#### **[Análisis del Estado Anterior (Deuda Técnica)]**
La página `/dashboard` anterior consistía en un `DashboardClient` que renderizaba una cuadrícula de `ActionCard`s arrastrables. Esta arquitectura, aunque flexible, carecía de dirección, no presentaba actividad reciente y resultaba genérica. La lógica de D&D para el layout es una sobreingeniería que se vuelve obsoleta con este nuevo diseño más estructurado y útil.

#### **[Arquitectura Propuesta (El Estado de Élite)]**
Este Server Component actuará como un ensamblador de alto nivel para la vista del dashboard. Sus responsabilidades son:

1.  **Obtener Datos Contextuales:** Consumirá los datos del `DashboardProvider` (establecido en el `layout.tsx`) para obtener el `user`, `activeWorkspace` y `recentCampaigns`.
2.  **Construir Props Contextuales:** Construirá el objeto de props para el `DashboardHeader` contextual, incluyendo los `breadcrumbs` y el título de la página.
3.  **Ensamblar Componentes de Cliente Atómicos:** Orquestará el renderizado de una serie de nuevos componentes especializados:
    *   **`DashboardHeader`:** Renderizado en la parte superior del área de contenido.
    *   **`WelcomeHero`:** Un nuevo componente que muestra un saludo personalizado ("¿Qué vamos a convertir hoy, {nombre}?"), el buscador principal de plantillas/campañas y accesos directos visuales.
    *   **`RecentActivity`:** Un nuevo componente que renderiza una cuadrícula de las campañas y sitios editados recientemente, con previsualizaciones.

**Diagrama de Flujo (Mermaid):**
```mermaid
graph TD
    A[DashboardPage (Server)] -- Consume --> B{DashboardContext};
    B -- Provee (user, recentCampaigns) --> A;
    A -- Construye Props --> C(DashboardHeaderProps);
    A -- Renderiza --> D[DashboardHeader];
    A -- Renderiza --> E[WelcomeHero];
    A -- Renderiza --> F[RecentActivity];
    C --> D;
    B -- Pasa Datos --> E;
    B -- Pasa Datos --> F;
[Contrato de Interacción y Dependencias]
Exportaciones: export default function DashboardPage.
Importaciones Clave: DashboardHeader, WelcomeHero (nuevo), RecentActivity (nuevo), y la lógica de getLayoutData (implícita a través del contexto).
Impacto Sistémico:
Obsoletos: DashboardClient.tsx y ActionCard.tsx quedan obsoletos y serán eliminados.
Nuevos Aparatos: Requiere la creación de WelcomeHero.tsx y RecentActivity.tsx.
[Estrategia de Pruebas]
Prueba E2E (Playwright):
Después del login, verificar que la URL sea /dashboard.
Verificar que el h1 en el WelcomeHero contenga el nombre del usuario.
Verificar que la sección "Actividad Reciente" (RecentActivity) esté presente y, si hay datos, que contenga tarjetas de campañas.
// .docs/espejo/dashboard/page.md