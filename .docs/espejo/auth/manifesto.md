// .docs/espejo/auth/manifesto.md
/**
 * @file .docs/espejo/auth/manifesto.md
 * @description Manifiesto de Arquitectura para el Flujo de Autenticación v3.0.
 *              Este documento es la Única Fuente de Verdad (SSoT) que formaliza la
 *              decisión estratégica de migrar de un flujo modal a un paradigma de
 *              páginas dedicadas (`/login`, `/signup`) con "Formularios Soberanos"
 *              para una UX de registro de élite y un control total.
 * @author Raz Podestá
 * @version 3.0.0
 */

# Manifiesto de Autenticación v3.0: Paradigma de Páginas Dedicadas de Élite

## 1. Filosofía Arquitectónica

**"Control Total, UX de Élite."** La arquitectura v3.0 abandona el paradigma modal en favor de **páginas de autenticación dedicadas** con **Formularios Soberanos**. La misión es construir un flujo de registro y login de nivel de producción, completamente de marca, que ofrezca una experiencia de usuario superior, segura y con feedback en tiempo real. Esta arquitectura, inspirada en el `paddle-nextjs-starter-kit`, nos da control absoluto sobre cada elemento del formulario (medidor de fortaleza de contraseña, checkboxes de T&C, etc.), mientras se integra a la perfección con el backend seguro de Supabase.

## 2. Diagrama de Flujo Lógico del Sistema (Páginas Dedicadas)

```mermaid
graph TD
    subgraph "Capa de Cliente (Navegador)"
        A[Usuario hace clic en Login/Signup en LandingHeader] --> B{Redirección a Páginas Dedicadas};
        B --> C[/login];
        B --> D[/signup];

        C -- Renderiza --> E[LoginForm.tsx];
        D -- Renderiza --> F[SignUpForm.tsx];

        F -- Compone --> G[PasswordStrengthMeter.tsx];
        F -- Compone --> H[Checkbox T&C];
        F -- Compone --> I[Checkbox Newsletter];
        E & F -- Componen --> J[OAuthButtonGroup.tsx con Google & Apple];

        E -- submit --> K1(Server Action: signInWithPasswordAction);
        F -- submit --> K2(Server Action: signUpAction);
        J -- submit --> K3(Server Action: signInWithOAuthAction);
    end

    subgraph "Capa de Servidor (Server Actions & API)"
        K1 & K2 & K3 -- Invocan --> L[auth.actions.ts];
        L -- Valida con --> Zod(Validators);
        L -- Llama a --> M[API de Supabase Auth];
        K3 -- Redirige a --> N[Página de Consentimiento OAuth];
        N -- Callback --> O[api/auth/callback/route.ts];
        O -- Intercambia código por sesión --> M;
        M -- Escribe en --> P(auth.users);
    end

    subgraph "Lógica de Base de Datos (Onboarding Atómico)"
        P -- Trigger: on_auth_user_created --> Q[Function: handle_new_user_setup];
        Q -- Crea --> R(profiles) & S(workspaces) & T(workspace_members);
    end
3. Desglose de Aparatos de Élite y Nuevas Directivas de UX
SignUpForm.tsx (Formulario Soberano de Registro):
Gestión de Estado: Utilizará react-hook-form con zodResolver para validación en tiempo real.
Fortaleza de Contraseña: Incluirá un componente visual que mida la fortaleza de la contraseña a medida que el usuario escribe.
Confirmación de Contraseña: El campo "Confirmar Contraseña" tendrá deshabilitada la funcionalidad de pegar (onPaste={e => e.preventDefault()}).
Checkboxes de Consentimiento:
Checkbox para "Acepto los Términos y Condiciones", con enlace a /terms. Este será obligatorio para el envío del formulario.
Checkbox para "Suscribirme a la newsletter". Este será opcional.
Proveedores OAuth (OAuthButtonGroup.tsx):
Proveedores Canónicos: El componente renderizará botones únicamente para Google y Apple, eliminando GitHub. Esto está alineado con la estrategia de enfocarse en plataformas móviles y de escritorio masivas.
Branding y Estilo:
Consistencia de Marca: Se mantendrá la paleta de colores y el sistema de diseño de ConvertiKit (bg-primary para CTAs, etc.), adaptando la estructura del kit de referencia a nuestra identidad visual, no al revés.
Estética Visual: Se migrarán los activos SVG y las clases CSS de login.css del kit de referencia para replicar los efectos de gradiente y desenfoque, creando una experiencia visual de élite.
/**
=====================================================================
code
Code
MEJORA CONTINUA
=====================================================================
@subsection Melhorias Adicionadas
SSoT Definitiva v3.0: ((Implementada)) Este manifiesto ahora refleja con precisión la nueva arquitectura de autenticación basada en páginas dedicadas y los requisitos de UX actualizados, sirviendo como la única fuente de verdad para la migración.
Visión Holística 360°: ((Implementada)) El documento integra las directivas de negocio (proveedores OAuth, checkboxes) con las decisiones técnicas (formularios soberanos, server actions), proveyendo un blueprint completo.
=====================================================================
*/