// .docs/functionality/012_ONBOARDING_AND_GUIDES_MANIFEST.md
/**
 * @file .docs/functionality/012_ONBOARDING_AND_GUIDES_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Onboarding & Guías Interactivas" v1.0.
 *              Esta es la SSoT que define la arquitectura para la experiencia de
 *              bienvenida y el futuro sistema de guías interactivas.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */

Blueprint: src/components/onboarding/WelcomeModal.tsx - El Modal de Bienvenida
[Tipo de Aparato]
Componente de UI de Cliente (Client Component).
[Filosofía de Diseño y Propósito]
La misión del WelcomeModal es proporcionar una bienvenida cálida y un único punto de acción claro para el nuevo usuario. Su filosofía es "Cero Fricción, Claridad Absoluta". No abruma con un tour, sino que celebra la llegada del usuario y lo orienta hacia el siguiente paso lógico.
Actúa como una capa de presentación sobre el dashboard principal. Su existencia está controlada por el flag has_completed_onboarding de la base de datos, lo que lo desacopla completamente del flujo de registro.
[Análisis del Estado Anterior (Deuda Técnica)]
El OnboardingDialog anterior forzaba la creación de un workspace en una página separada (/welcome), interrumpiendo el flujo del usuario y creando una experiencia disociada. No había un verdadero "momento de bienvenida".
[Arquitectura Propuesta (El Estado de Élite)]
El WelcomeModal será un componente de cliente que utiliza el Dialog de Shadcn/UI.
Lógica de Renderizado:
El DashboardLayout (Server Component) leerá el flag profile.has_completed_onboarding.
Si el flag es false, el DashboardLayout renderizará el <WelcomeModal />. El modal se mostrará automáticamente sobre el dashboard ya cargado.
Componente Interno (WelcomeModal.tsx):
Estado: Utilizará useState para controlar su visibilidad (isOpen) y useTransition para el estado de carga del botón.
Contenido:
Un DialogHeader con un saludo de bienvenida personalizado.
Un DialogBody con un breve texto explicando el próximo paso.
Un DialogFooter con un único botón de CTA ("¡Vamos allá!" o "Continuar").
Acción: Al hacer clic en el CTA, el componente invocará la Server Action completeOnboardingAction.
Cierre: Tras una respuesta exitosa de la Server Action, el estado isOpen se establecerá en false, cerrando el modal y revelando el dashboard completamente interactivo.
Diagrama de Flujo (Mermaid):
code
Mermaid
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

# Manifiesto Funcional: Dominio "Onboarding & Guías Interactivas"

## 1. Rol Estratégico y Propósito de Negocio

Este dominio es el **primer punto de contacto de valor** con el usuario después del registro. Su propósito es doble:
1.  **Reducir la Fricción Inicial:** Proporcionar una bienvenida clara (`WelcomeModal`) y guiar al usuario en sus primeros pasos.
2.  **Aumentar el Engagement y la Adopción:** A través de futuras guías interactivas (mini-cursos), enseñar proactivamente al usuario a utilizar las características clave de la plataforma, acelerando su "tiempo hasta el valor".

*   **Filosofía:** "Aprendizaje Contextual y No Bloqueante". El onboarding inicial es una bienvenida simple. Las guías futuras serán opcionales, no intrusivas y accesibles desde el dashboard para que el usuario aprenda a su propio ritmo.

## 2. Arquitectura de Flujo

### 2.1. El `WelcomeModal` (Implementación Actual)

*   **Trigger:** El `DashboardLayout` (Server Component) lee el flag `profiles.has_completed_onboarding`. Si es `false`, renderiza el modal.
*   **Comportamiento:**
    *   Es un modal **no bloqueante** en cuanto a la interacción con la página (el usuario puede cerrarlo).
    *   Al hacer clic en "Continuar", invoca la `completeOnboardingAction`, que actualiza el flag en la base de datos a `true`.
*   **Persistencia:** El estado (visto/no visto) se almacena en la base de datos, garantizando que solo se muestre una vez por usuario, independientemente del dispositivo.

### 2.2. Guías Interactivas (Arquitectura Futura)

Esta es la evolución del `WelcomeModal` hacia un sistema de aprendizaje.

*   **SSoT de Datos:** Se creará una nueva tabla `user_guides_progress`.
    *   **Columnas:** `user_id`, `guide_id` (ej. "welcome_tour", "creating_first_site"), `current_step` (integer), `status` ('not_started', 'in_progress', 'completed').
*   **SSoT de Lógica de UI:** Un futuro hook soberano `useInteractiveGuide()`.
*   **Implementación:**
    1.  **Disparador:** Un nuevo componente en el dashboard, "Centro de Ayuda" o "Primeros Pasos", mostrará las guías disponibles.
    2.  **Lógica del Hook:** El hook `useInteractiveGuide` leerá el estado de la guía actual desde la tabla `user_guides_progress`.
    3.  **Renderizado del Tour:** Utilizará una librería como `react-joyride` o una solución personalizada para mostrar tooltips y modales que resalten diferentes partes de la UI en secuencia.
    4.  **Persistencia del Progreso:** Cada vez que el usuario avance un paso, el hook invocará una nueva `Server Action` `updateGuideProgressAction` para actualizar la base de datos.

*   **Diagrama de Arquitectura Futura (Mermaid):**
    ```mermaid
    graph TD
        subgraph "Dashboard UI"
            A[Centro de Ayuda] -- Clic en 'Iniciar Guía' --> B{Hook useInteractiveGuide};
        end
        
        subgraph "Lógica de Guía"
            B -- Lee/Escribe Progreso --> C[updateGuideProgressAction];
            B -- Controla --> D[Componente de Tour (Joyride)];
        end
        
        subgraph "Servidor"
            C -- Actualiza --> E((db.user_guides_progress));
        end
    ```

## 3. Roadmap de Evolución del Dominio

*   **Completado:**
    *   Implementación del `WelcomeModal` con persistencia en `profiles.has_completed_onboarding`.
*   **Próximos Pasos (Vigente):**
    1.  **Diseñar Tabla `user_guides_progress`:** Definir el esquema completo en `schema.sql`.
    2.  **Crear Manifiesto de Contenido de Guías:** Documentar los pasos de la primera guía ("Tour de Bienvenida") en un archivo de configuración.
    3.  **Implementar `useInteractiveGuide` y `updateGuideProgressAction`:** Desarrollar el núcleo de la lógica de las guías interactivas.
    4.  **Integrar Librería de Tour:** Seleccionar e integrar una librería de UI para renderizar los pasos del tour.

// .docs/functionality/012_ONBOARDING_AND_GUIDES_MANIFEST.md