// .docs/espejo/onboarding/welcome-modal.md
/**
 * @file .docs/espejo/onboarding/welcome-modal.md
 * @description Blueprint Arquitectónico de Élite para el `WelcomeModal`.
 *              Define la arquitectura del modal de onboarding desacoplado,
 *              que se renderiza condicionalmente sobre el nuevo dashboard.
 * @author Raz Podestá
 * @version 9.1.0
 */
# Blueprint: `src/components/onboarding/WelcomeModal.tsx` - El Modal de Bienvenida

#### **[Tipo de Aparato]**
Componente de UI de Cliente (Client Component).

#### **[Filosofía de Diseño y Propósito]**
La misión del `WelcomeModal` es proporcionar una **bienvenida cálida y un único punto de acción claro** para el nuevo usuario. Su filosofía es "Cero Fricción, Claridad Absoluta". No abruma con un tour, sino que celebra la llegada del usuario y lo orienta hacia el siguiente paso lógico.

Actúa como una capa de presentación sobre el dashboard principal. Su existencia está controlada por el flag `has_completed_onboarding` de la base de datos, lo que lo desacopla completamente del flujo de registro.

#### **[Análisis del Estado Anterior (Deuda Técnica)]**
El `OnboardingDialog` anterior forzaba la creación de un workspace en una página separada (`/welcome`), interrumpiendo el flujo del usuario y creando una experiencia disociada. No había un verdadero "momento de bienvenida".

#### **[Arquitectura Propuesta (El Estado de Élite)]**
El `WelcomeModal` será un componente de cliente que utiliza el `Dialog` de Shadcn/UI.

**Lógica de Renderizado:**
- El `DashboardLayout` (Server Component) leerá el flag `profile.has_completed_onboarding`.
- Si el flag es `false`, el `DashboardLayout` renderizará el `<WelcomeModal />`. El modal se mostrará automáticamente sobre el dashboard ya cargado.

**Componente Interno (`WelcomeModal.tsx`):**
1.  **Estado:** Utilizará `useState` para controlar su visibilidad (`isOpen`) y `useTransition` para el estado de carga del botón.
2.  **Contenido:**
    - Un `DialogHeader` con un saludo de bienvenida personalizado.
    - Un `DialogBody` con un breve texto explicando el próximo paso.
    - Un `DialogFooter` con un único botón de CTA ("¡Vamos allá!" o "Continuar").
3.  **Acción:** Al hacer clic en el CTA, el componente invocará la Server Action `completeOnboardingAction`.
4.  **Cierre:** Tras una respuesta exitosa de la Server Action, el estado `isOpen` se establecerá en `false`, cerrando el modal y revelando el dashboard completamente interactivo.

**Diagrama de Flujo (Mermaid):**
```mermaid
graph TD
    subgraph "Server (DashboardLayout)"
        A[getLayoutData] -- Lee --> B{profile.has_completed_onboarding};
        B -- Es false --> C[Renderiza <WelcomeModal />];
    end

    subgraph "Client (WelcomeModal.tsx)"
        C -- Se monta y abre --> D{Dialog Abierto};
        D -- Usuario hace clic en CTA --> E[Invoca completeOnboardingAction];
        E -- on Success --> F[Cierra Dialog (setIsOpen(false))];
    end

    subgraph "Server (onboarding.actions.ts)"
        E --> G[completeOnboardingAction];
        G -- Actualiza BD --> H(profiles.has_completed_onboarding = true);
    end
[Contrato de Interacción y Dependencias]
Exportaciones: export function WelcomeModal.
Importaciones Clave: Dialog, Button, completeOnboardingAction.
Impacto Sistémico:
DashboardLayout: Deberá ser modificado para incluir la lógica de renderizado condicional.
onboarding.actions.ts: Requiere la creación de este nuevo archivo de Server Actions.
OnboardingDialog.tsx (Obsoleto): Este nuevo modal reemplaza por completo al OnboardingDialog y la página /welcome.
[Estrategia de Pruebas]
Prueba E2E (Playwright):
Después del registro y creación del primer workspace, verificar que el WelcomeModal es visible sobre el dashboard.
Hacer clic en el botón de continuar.
Verificar que el modal desaparece y que el dashboard es interactivo.
Recargar la página y verificar que el modal no vuelve a aparecer.
// .docs/espejo/onboarding/welcome-modal.md