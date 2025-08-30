// .docs/functionality/005_AUTHENTICATION_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/005_AUTHENTICATION_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Authentication" v1.0.
 *              Esta es la SSoT que define el ciclo de vida completo del usuario.
 *              Reemplaza a la versión anterior.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Authentication"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-005.
*   El dominio de Autenticación es el **portal de seguridad y el punto de partida de la experiencia del usuario**. Su propósito es verificar la identidad, establecer una sesión segura y orquestar un onboarding sin fricciones.
*   **Filosofía:** "Seguro por Defecto, Experiencia Fluida".

## 2. Funcionalidades Implementadas
*   **Registro Multi-Método:** Creación de cuentas vía email/contraseña y OAuth (Google).
*   **Onboarding Atómico Automatizado:** Al registrarse un nuevo usuario, un trigger de PostgreSQL (`on_auth_user_created`) invoca la RPC `handle_new_user_setup`. Esta función, en una **única transacción**, crea el `profile`, el primer `workspace` y la membresía de `owner`.
*   **Gestión de Sesión Robusta:** Se utiliza `@supabase/ssr` para gestionar de forma segura JWTs en cookies y la sincronización entre Server Components y el cliente.
*   **Recuperación de Contraseña:** Flujo seguro de restablecimiento vía email.

## 3. Arquitectura Técnica y Flujos Críticos

### 3.1. SSoT de Lógica de Negocio
*   `src/lib/actions/auth.actions.ts`, `password.actions.ts`, `session.actions.ts`
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

## 4. Roadmap de Evolución del Dominio
*   **Completado:** Flujos de registro, login (email/OAuth), logout, recuperación de contraseña, onboarding atómico.
*   **Próximos Pasos (Vigente):**
    1.  Implementar **Login Sin Contraseña (Magic Links)**.
    2.  Integrar **Autenticación de Múltiples Factores (MFA)**.
    3.  Añadir soporte para más **Proveedores OAuth** (GitHub, Microsoft).
    4.  Crear UI para **Auditoría y Gestión de Sesiones** por el usuario.
// .docs/functionality/005_AUTHENTICATION_DOMAIN_MANIFEST.md