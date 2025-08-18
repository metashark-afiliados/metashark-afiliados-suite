La visión es clara: un sistema resiliente, con una UX superior, que jamás pierda el trabajo del usuario y minimice la comunicación superflua con la base de datos.
FASE 1: Manifiesto de Arquitectura v8.0: Resiliencia y Flujo de Usuario Soberano
Este documento es la Única Fuente de Verdad para la nueva arquitectura.
1. Visión General y Filosofía
Abandonamos el flujo de onboarding explícito post-registro. La nueva filosofía es "Onboarding Implícito y Persistencia por Defecto". Cada acción del usuario es segura y su trabajo está protegido, incluso offline.
Onboarding Atómico: El registro de un usuario y la creación de su entorno de trabajo inicial serán una única operación transaccional a nivel de base de datos.
Contexto Persistente: La sesión del usuario y su contexto de trabajo activo (active_workspace_id) se gestionarán a través de cookies seguras httpOnly, leídas en el servidor para una renderización contextual instantánea.
Persistencia Local-First (El "Guardián de Datos"): El estado crítico de la aplicación (ej. contenido de una campaña en el builder) se persistirá localmente en localStorage a través de Zustand. La sincronización con la base de datos será una acción explícita o automática en eventos clave, garantizando cero pérdida de datos.
2. El Nuevo Flujo de Onboarding Implícito
El modal de "Welcome" se separa del flujo de creación del workspace.
code
Mermaid
graph TD
    subgraph "Cliente (Navegador)"
        A[Usuario se registra (Email/OAuth)] --> B[Invoca signUpAction];
    end

    subgraph "Servidor (Supabase Auth)"
        B --> C(auth.users: Nuevo registro creado);
    end

    subgraph "Base de Datos (Trigger de Élite)"
        C -- Dispara --> D(Trigger: on_auth_user_created);
        D -- Invoca --> E[RPC: handle_new_user_setup];
        E -- Crea Transaccionalmente --> F(1. public.profiles);
        E -- Crea Transaccionalmente --> G(2. public.workspaces - Por defecto);
        E -- Crea Transaccionalmente --> H(3. public.workspace_members - Rol 'owner');
    end

    subgraph "Servidor (Callback y Sesión)"
        C -- Retorna al cliente --> I[Redirige a /api/auth/callback];
        I -- Llama a --> J[Server Action: getFirstWorkspaceAndSetCookie];
        J -- Obtiene --> G;
        J -- Establece Cookie --> K(Cookie: active_workspace_id);
        K --> L[Redirige a /dashboard];
    end
Lógica de Persistencia del Contexto: Al primer inicio de sesión, una Server Action identificará el único workspace del usuario, establecerá su ID en la cookie active_workspace_id y lo redirigirá al dashboard. En visitas posteriores, el DashboardLayout leerá esta cookie para cargar el contexto correcto.
Lógica del Modal de Bienvenida:
Se añadirá una columna has_completed_onboarding: boolean a la tabla profiles, con valor por defecto false.
El DashboardLayout (Server Component) leerá este flag. Si es false, renderizará el WelcomeModal.
Al cerrar el modal, se invocará una Server Action completeOnboardingAction que actualizará el flag a true y no se mostrará más.
3. Gestión de Workspaces Soberana (Sin Emojis)
La gestión del nombre del workspace será una experiencia fluida y en línea.
UI: El nombre del workspace en el WorkspaceSwitcher y DashboardHeader será un componente que, al hacer clic, se transforma en un campo de texto.
Validación: Se aplicará un CreateWorkspaceSchema de Zod:
trim()
min(3, "El nombre debe tener al menos 3 caracteres.")
max(40, "El nombre no puede exceder los 40 caracteres.")
.regex(/^[a-zA-Z0-9\s-]+$/, "Solo se permiten letras, números, espacios y guiones.")
Lógica: Al perder el foco (onBlur) o presionar Enter, se invocará una updateWorkspaceNameAction(workspaceId, newName) que validará y actualizará el nombre en la base de datos. La UI reflejará el cambio de forma optimista.
4. Arquitectura de Persistencia de Élite (El "Guardián de Datos")
Este sistema es el núcleo de la resiliencia y la performance. Se centrará en el builder de campañas.
code
Mermaid
graph TD
    subgraph "UI (Builder en Navegador)"
        A[Usuario edita campaña] --> B{Zustand Store};
        B -- Actualiza estado --> C[Renderiza Canvas];
        B -- Middleware 'persist' --> D[Guarda en localStorage];
        E[Botón 'Guardar'] -- Clic --> F[Invoca updateCampaignAction];
        G[Barra de Estado Global] -- Suscrito a --> B;
        G -- Muestra --> H(Estado: 'Cambios sin guardar');
        G -- Muestra --> I(Último guardado: 'hace 2 min');
        G -- Detecta navigator.onLine --> J(Estado: 'Offline');
    end

    subgraph "Lógica de Sincronización (Servidor)"
        F -- Envía estado de B --> K[Server Action: updateCampaignContentAction];
        K -- Valida y guarda en --> L(Base de Datos Supabase);
        L -- Retorna éxito --> B;
        B -- Actualiza 'lastSaved' y 'isDirty=false' --> G;
    end
Aparatos Clave:
useBuilderStore (Zustand): Se le añadirá el middleware persist para guardar automáticamente el campaignConfig en localStorage.
StatusBar.tsx: Nuevo componente de UI global que se suscribirá al useBuilderStore y al estado de conexión del navegador para mostrar el estado de guardado, la última sincronización y el estado online/offline.
updateCampaignContentAction: La Server Action existente será el punto final para la sincronización explícita.