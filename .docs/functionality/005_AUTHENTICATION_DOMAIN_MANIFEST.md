// .docs/functionality/005_AUTHENTICATION_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/005_AUTHENTICATION_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Authentication" v2.0.
 *              Esta es la SSoT que define el ciclo de vida completo del usuario,
 *              alineado con la arquitectura de UI refactorizada.
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Authentication" v2.0

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-005
*   **Referencia a la Misión:** `.docs/roadmap/010_AUTH_REFACTOR_MISSION_V4.md`
*   El dominio de Autenticación es el **portal de seguridad y el punto de partida de la experiencia del usuario**. Su propósito es verificar la identidad, establecer una sesión segura y orquestar un onboarding sin fricciones.
*   **Filosofía:** "Seguro por Defecto, Experiencia Cinematográfica Fluida".

## 2. Arquitectura Técnica y de Componentes
La arquitectura del dominio se divide en dos capas desacopladas: la lógica de negocio del backend y la orquestación de la interfaz del frontend.

### 2.1. Arquitectura de Backend: Flujo de Datos y Lógica
*   **SSoT de Lógica de Negocio:** `src/lib/actions/auth.actions.ts`, `password.actions.ts`, `session.actions.ts`
*   **SSoT de Persistencia:** Trigger de PostgreSQL `on_auth_user_created` y la RPC `handle_new_user_setup`.
*   **Flujo Crítico (Onboarding Atómico):**
    ```mermaid
    sequenceDiagram
        participant Client as UI (Formulario)
        participant Server as Server Action
        participant SupabaseAuth as Supabase Auth
        participant DB as PostgreSQL DB

        Client->>Server: signUpAction(formData)
        Server->>SupabaseAuth: supabase.auth.signUp()
        SupabaseAuth-->>DB: INSERT INTO auth.users
        Note right of DB: TRIGGER on_auth_user_created
        DB->>DB: RPC handle_new_user_setup()
        DB-->>DB: (TRANSACTION) INSERT profiles, workspaces, workspace_members
        SupabaseAuth-->>Server: Éxito
        Server-->>Client: redirect('/auth-notice')
    ```

### 2.2. Arquitectura de Frontend: El Portal de Acceso
*   **Filosofía:** "Hook Soberano / Componente de Presentación Puro". La lógica, el estado y el contenido están encapsulados en hooks, mientras que los componentes son "tontos" y se dedican exclusivamente a renderizar.
*   **SSoT de Lógica de UI:**
    *   `src/lib/hooks/useSignUpForm.ts`
    *   `src/lib/hooks/useLoginForm.ts`
*   **Jerarquía de Componentes ("Filosofía LEGO"):**
    1.  **Página (`page.tsx`):** Orquestador que ensambla el layout y el formulario.
    2.  **Layout (`AuthCardLayout.tsx`):** Proporciona la estructura visual inmersiva.
    3.  **Formulario (`SignupForm.tsx`):** Ensamblador de UI que consume el hook soberano.
    4.  **Campos (`SignUp...Field.tsx`):** Ladrillos atómicos y puros que renderizan los inputs.
*   **Flujo de Datos del Frontend:**
    ```mermaid
    graph TD
        A[Página (page.tsx)] --> B[Formulario (SignupForm.tsx)];
        B --> C{Hook Soberano (useSignUpForm)};
        C -- provee lógica y textos --> B;
        C -- gestiona --> D[react-hook-form];
        C -- invoca --> E[Server Action];
        B -- compone --> F[Campos Atómicos (SignUp...Field.tsx)];
    ```

## 3. Funcionalidades de UX/UI de Élite Implementadas
*   **Validación en Tiempo Real:** Los formularios utilizan `react-hook-form` con `zodResolver` y `mode: 'onTouched'` para proporcionar feedback de validación instantáneo.
*   **Guía de Fortaleza de Contraseña:** El `PasswordStrengthMeter` ofrece feedback visual en tiempo real sobre la robustez de la contraseña.
*   **Visualización de Contraseña ("Ojo"):** Los campos de contraseña incluyen un icono `Eye`/`EyeOff` para permitir al usuario alternar la visibilidad.
*   **Diseño de Alta Confianza:** Iconos (`Mail`, `Lock`) integrados en los campos y checkboxes explícitos para Términos/Privacidad.
*   **Feedback de Acción No Bloqueante:** El estado de envío es manejado con `useTransition`, mostrando un spinner en el botón sin bloquear la UI.

## 4. Zona de Melhorias Futuras
1.  **Login Sin Contraseña (Magic Links):** Implementar un flujo de autenticación basado en enlaces mágicos enviados por correo electrónico.
2.  **Autenticación de Múltiples Factores (MFA):** Integrar soporte para TOTP (ej. Google Authenticator) como segundo factor de autenticación.
3.  **Soporte para Más Proveedores OAuth:** Añadir la opción de iniciar sesión con proveedores como GitHub, Microsoft o LinkedIn.
4.  **Auditoría y Gestión de Sesiones:** Crear una UI en los ajustes del perfil que permita a los usuarios ver todas sus sesiones activas y cerrar remotamente las que no reconozcan.
5.  **Flujo de Vinculación de Cuentas:** Implementar una lógica que permita a un usuario vincular múltiples proveedores OAuth (ej. Google y GitHub) a la misma cuenta de ConvertiKit.
6.  **Protección Avanzada contra Bots:** Integrar un servicio como hCaptcha o reCAPTCHA v3 en los formularios de registro e inicio de sesión.
7.  **Soporte para Passkeys:** Implementar la autenticación sin contraseña utilizando WebAuthn (Passkeys) para una seguridad y UX de vanguardia.
8.  **Detección de Brechas de Seguridad:** Integrar el validador de contraseñas con la API de "Have I Been Pwned" para advertir a los usuarios si la contraseña elegida ha sido comprometida en una brecha de datos conocida.
9.  **Flujo de Re-autenticación para Acciones Sensibles:** Implementar un mecanismo que solicite al usuario volver a introducir su contraseña antes de realizar acciones críticas (ej. cambiar de email, eliminar cuenta).
10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.

// .docs/functionality/005_AUTHENTICATION_DOMAIN_MANIFEST.md