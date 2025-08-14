/**
 * @file .docs/espejo/auth/manifesto-v2.md
 * @description Manifiesto de Arquitectura para el Flujo de Autenticación v2.0.
 *              Este documento es la Única Fuente de Verdad (SSoT) que formaliza la
 *              decisión estratégica de adoptar un "Paradigma Híbrido de Élite" con
 *              Formularios Soberanos para una UX superior y control total, mientras se
 *              delega la lógica de seguridad a las Server Actions y la API de Supabase.
 * @author Raz Podestá
 * @version 2.0.0
 */

# Manifiesto de Autenticación v2.0: Paradigma Híbrido de Élite

## 1. Filosofía Arquitectónica

**"Control Total, UX Superior."** La arquitectura v2.0 abandona la delegación de la UI para adoptar un modelo de **Formularios Soberanos**. La misión es construir un flujo de autenticación modal, completamente personalizado y de marca, que ofrezca una experiencia de usuario de élite. Obtenemos control absoluto sobre cada elemento del formulario (medidor de fortaleza de contraseña, checkboxes de T&C), mientras seguimos utilizando el robusto y seguro backend de Supabase para la lógica de autenticación, combinando lo mejor de ambos mundos.

## 2. Diagrama de Flujo Lógico del Sistema Completo

Este diagrama visualiza el viaje completo del usuario y el flujo de datos, desde la interacción inicial en la UI hasta la confirmación en la base de datos.

```mermaid
graph TD
    subgraph "Capa de Cliente (Navegador)"
        A[Usuario hace clic en Login/Signup] -- Llama a --> B(useAuthModalStore.openModal);
        B -- Actualiza Estado --> C{AuthDialog};
        C -- Renderiza Condicionalmente --> D{Formulario Soberano};
        D -- Es 'signup' --> E[SignUpForm.tsx];
        D -- Es 'login' --> F[LoginForm.tsx];
        E -- Compone --> G[PasswordStrengthMeter.tsx];
        E -- Compone --> H[Checkboxes T&C/Newsletter];
        E & F -- Componen --> I[OAuthButtons.tsx];
        E -- submit --> J1(Server Action: signUpAction);
        F -- submit --> J2(Server Action: signInWithPasswordAction);
        I -- submit --> J3(Server Action: signInWithOAuthAction);
    end

    subgraph "Capa de Servidor (Server Actions & API)"
        J1 & J2 & J3 -- Invocan --> K[auth.actions.ts];
        K -- Valida con --> Zod(Validators);
        K -- Llama a --> L[API de Supabase Auth];
        J3 -- Redirige a --> M[Página de Consentimiento OAuth];
        M -- Callback --> N[api/auth/callback/route.ts];
        N -- Intercambia código por sesión --> L;
        L -- Escribe en --> O(auth.users);
    end

    subgraph "Lógica de Base de Datos (Automatización)"
        O -- Trigger: on_auth_user_created --> P[Function: handle_new_user_setup];
        P -- Crea --> Q(profiles) & R(workspaces) & S(workspace_members);
    end
3. Desglose de Aparatos de Élite (Deep Dive)
useAuthModalStore.ts (El Estado Central):
Responsabilidad: Un store de Zustand que actúa como la SSoT para el estado del modal de autenticación (isOpen, view). Desacopla completamente el estado de la UI, permitiendo que cualquier componente de la aplicación pueda invocar openModal('login').
Principio: Single Source of Truth, Desacoplamiento.
AuthDialog.tsx (El Orquestador Modal):
Responsabilidad: Renderiza el Dialog modal. Se suscribe al useAuthModalStore y muestra condicionalmente LoginForm.tsx o SignUpForm.tsx según el estado view. Compone el AuthFooter.tsx para permitir el cambio de vistas.
Principio: Orquestación, Composición.
LoginForm.tsx y SignUpForm.tsx (Los Formularios Soberanos):
Responsabilidad: Son componentes de cliente "inteligentes" que gestionan su propio estado de formulario.
Lógica Interna: Utilizan react-hook-form para la gestión de estado y zodResolver para la validación de campos en tiempo real (feedback instantáneo al usuario).
Interacción: En el onSubmit, invocan la Server Action correspondiente (signInWithPasswordAction o signUpAction).
Aparatos Atómicos de UI (PasswordStrengthMeter.tsx, OAuthButtons.tsx, Checkbox.tsx):
Responsabilidad: Son "piezas de LEGO" puras y de presentación. PasswordStrengthMeter visualiza la fortaleza de la contraseña. OAuthButtons renderiza los botones de proveedores sociales. Son completamente controlados por los formularios soberanos.
Principio: Atomicidad Radical.
auth.actions.ts (El Núcleo Lógico del Servidor):
Responsabilidad: Contiene la lógica de negocio segura.
Acciones:
signUpAction: Valida los datos con el schema Zod, llama a supabase.auth.signUp.
signInWithPasswordAction: Valida, aplica rate-limiting, y llama a supabase.auth.signInWithPassword.
signInWithOAuthAction: Llama a supabase.auth.signInWithOAuth y devuelve una URL de redirección.
Principio: Seguridad por Defecto, Lógica de Servidor Centralizada.
api/auth/callback/route.ts (El Intercambiador de Sesión):
Responsabilidad: Punto final al que Supabase y los proveedores OAuth redirigen tras un login exitoso. Su única función es intercambiar el code de la URL por una sesión de usuario válida y redirigir al dashboard.
Principio: Single Responsibility Principle.
4. El Manifiesto de Cookies de Autenticación
La seguridad de la sesión se basa en cookies gestionadas por la librería @supabase/ssr, configuradas con las mejores prácticas de seguridad.
Nombre de Cookie (Patrón)	Propietario / Mecanismo	Propósito	Tipo	HttpOnly	SameSite
sb-<project_ref>-auth-token	@supabase/ssr	CRÍTICA: Contiene el JWT de sesión (Access Token y Refresh Token). Es el pilar de la seguridad y la persistencia de la sesión. Se gestiona automáticamente en el servidor.	Esencial	✅ Sí	Lax
sb-csrf	@supabase/ssr	SEGURIDAD: Almacena un token CSRF para proteger contra ataques de falsificación de solicitudes entre sitios en las interacciones con la API de Supabase.	Seguridad	✅ Sí	Strict
Análisis de Seguridad: El flag HttpOnly es de vital importancia, ya que previene el acceso a la cookie de sesión desde el JavaScript del lado del cliente, mitigando drásticamente el riesgo de ataques XSS (Cross-Site Scripting).
5. Lógica de Onboarding Automatizada (El Trigger)
El flujo de autenticación no termina en el login; se integra con la lógica de negocio a través de un trigger de base de datos.
Aparato: Trigger on_auth_user_created en la tabla auth.users.
Lógica:
Cuando Supabase Auth crea un nuevo registro en auth.users (tras una confirmación de email exitosa).
El trigger invoca la función handle_new_user_setup.
Esta función, dentro de una transacción atómica:
Crea una fila correspondiente en public.profiles.
Crea un workspace personal por defecto para el usuario.
Crea una entrada en workspace_members, asignando al usuario el rol de owner en su nuevo workspace.
Resultado: Cada nuevo usuario tiene una experiencia de onboarding consistente y automática, garantizando la integridad de los datos desde el primer momento.
/**
=====================================================================
code
Code
MEJORA CONTINUA
=====================================================================
@subsection Melhorias Adicionadas
Control Total y UX Superior: ((Implementada)) Esta arquitectura proporciona control total sobre la UI, permitiendo la implementación de una UX de registro de élite.
SSoT Definitiva: ((Implementada)) Este manifiesto documenta exhaustivamente cada capa del sistema de autenticación (UI, Estado, Servidor, Base de Datos, Cookies).
Cohesión y Atomicidad: ((Implementada)) Define una clara separación de responsabilidades entre los aparatos, adhiriéndose a la "Filosofía LEGO".
@subsection Melhorias Futuras
Internacionalización de Errores Zod: ((Vigente)) Los mensajes de error de los schemas de Zod deben ser claves de i18n, y las Server Actions deben devolver estas claves para que la UI pueda mostrar mensajes traducidos.
Autenticación "Magic Link": ((Vigente)) Añadir un flujo de "Magic Link" como una tercera vía de autenticación sin contraseña.
Validación de URL de Redirección: ((Vigente)) Para una seguridad de élite, la URL en el parámetro next en el callback debe ser validada contra una lista blanca de rutas permitidas.
=====================================================================
*/