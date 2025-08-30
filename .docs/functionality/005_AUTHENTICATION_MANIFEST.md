// .docs/functionality/005_AUTHENTICATION_MANIFEST.md
/**
 * @file .docs/functionality/005_AUTHENTICATION_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Authentication" v1.0.
 *              Esta es la SSoT que define el ciclo de vida completo del usuario,
 *              desde el registro hasta la gestión de la sesión.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Authentication"

## 1. Rol Estratégico y Propósito de Negocio

El dominio de Autenticación es el **portal de seguridad y el punto de partida de la experiencia del usuario**. Su propósito es verificar la identidad, establecer un contexto de sesión seguro y orquestar un proceso de onboarding sin fricciones.

*   **Filosofía:** "Seguro por Defecto, Experiencia Fluida". La seguridad es innegociable, pero debe ser implementada de una manera que resulte casi invisible para el usuario legítimo.

## 2. Funcionalidades Implementadas

*   **Registro Multi-Método:** Creación de cuentas a través de email/contraseña y proveedores OAuth (actualmente Google).
*   **Onboarding Atómico Automatizado:** Al registrarse un nuevo usuario en `auth.users`, un trigger de PostgreSQL (`on_auth_user_created`) se dispara e invoca la RPC `handle_new_user_setup`. Esta función, en una **única transacción**, crea el `profile`, el primer `workspace` y la membresía de `owner`, garantizando la consistencia de los datos.
*   **Inicio de Sesión Seguro:** Flujo estándar de email/password y OAuth.
*   **Gestión de Sesión Robusta:** Se utiliza la librería `@supabase/ssr` que gestiona de forma segura el almacenamiento de JWT en cookies, la actualización automática de tokens y la sincronización entre Server Components y el cliente.
*   **Recuperación de Contraseña:** Flujo seguro de restablecimiento de contraseña a través de un enlace enviado por correo electrónico.

## 3. Arquitectura Técnica y Flujos Críticos

### 3.1. SSoT de Lógica de Negocio
*   `src/lib/actions/auth.actions.ts`
*   `src/lib/actions/password.actions.ts`
*   `src/lib/actions/session.actions.ts`
*   `src/db/schema.sql` (trigger `on_auth_user_created`)

### 3.2. Flujo Crítico: Registro y Onboarding Atómico

*   **Diagrama de Secuencia (Mermaid):**
    ```mermaid
    sequenceDiagram
        participant Client as UI
        participant Server as Server Action
        participant SupabaseAuth as Supabase Auth
        participant DB as PostgreSQL DB
        
        Client->>Server: signUpAction(email, pass)
        Server->>SupabaseAuth: supabase.auth.signUp()
        SupabaseAuth-->>DB: INSERT INTO auth.users
        Note right of DB: TRIGGER on_auth_user_created
        DB->>DB: RPC handle_new_user_setup()
        DB-->>DB: (TRANSACTION) INSERT profiles, workspaces, workspace_members
        SupabaseAuth-->>Server: Éxito
        Server-->>Client: redirect('/auth-notice')
    ```

### 3.3. Flujo Crítico: Callback de OAuth

*   **Descripción:** El `route.ts` en `/api/auth/callback` gestiona el intercambio del código de autorización por una sesión. La principal complejidad es la posible condición de carrera entre la creación de la sesión por Supabase y la finalización del trigger `handle_new_user_setup`.
*   **Implementación Actual:** Utiliza un sondeo (`waitForProfile`) como red de seguridad.
*   **Mejora Conceptual:** La robustez del trigger hace que el sondeo sea en gran medida redundante. En una futura refactorización, el sondeo podría ser reemplazado por una única consulta de verificación, confiando en la atomicidad del trigger.

## 4. Roadmap de Evolución del Dominio

*   **Completado:** Flujos de registro, login (email/OAuth), logout, recuperación de contraseña, onboarding atómico.
*   **Próximos Pasos (Vigente):**
    1.  **Login Sin Contraseña (Magic Links):** Implementar una `Server Action` `sendMagicLinkAction` que utilice `supabase.auth.signInWithOtp()` para ofrecer un flujo de inicio de sesión sin contraseña, mejorando la UX y la seguridad.
    2.  **Autenticación de Múltiples Factores (MFA):** Integrar las capacidades de MFA de Supabase. Esto requerirá una nueva página en el flujo de login para introducir el código TOTP y una nueva sección en los ajustes de perfil para que el usuario la configure.
    3.  **Expansión de Proveedores OAuth:** Añadir soporte para otros proveedores relevantes (ej. GitHub, Microsoft) en el `OAuthButtonGroup` y en la configuración de Supabase.
    4.  **Auditoría y Gestión de Sesiones:** Crear una sección en los ajustes de perfil que invoque `supabase.auth.admin.signOut()` para sesiones específicas, permitiendo a los usuarios ver sus sesiones activas y revocar el acceso a dispositivos desconocidos.

// .docs/functionality/005_AUTHENTICATION_MANIFEST.md