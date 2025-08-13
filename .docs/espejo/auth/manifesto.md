// .docs/espejo/auth/manifesto.md
/**
 * @file .docs/espejo/auth/manifesto.md
 * @description Manifiesto de Arquitectura para el Flujo de Autenticación v1.0.
 *              Este documento es la Única Fuente de Verdad (SSoT) que formaliza la
 *              decisión estratégica de delegar la UI y la lógica de autenticación
 *              a la librería `@supabase/auth-ui-react`.
 * @author Raz Podestá
 * @version 1.0.0
 */

# Manifiesto de Autenticación v1.0: Arquitectura Delegada

**[Tipo de Aparato]**
Manifiesto de Arquitectura.

**[Filosofía de Diseño y Propósito]**
"Velocidad, Robustez y Pragmatismo". La misión de esta arquitectura es acelerar la reconstrucción del proyecto estabilizando el flujo de usuario más crítico (registro e inicio de sesión) de la manera más rápida y fiable posible. Se delega la complejidad de la UI, la gestión de estado del formulario y el flujo de autenticación a `@supabase/auth-ui-react`, una solución de nivel de producción, para que el equipo pueda centrarse en la reconstrucción de la lógica de negocio principal de la aplicación.

**[Análisis del Estado Anterior (Deuda Técnica)]**
El blueprint original proponía un "paradigma de control total" con formularios soberanos construidos desde cero con `react-hook-form` y `zod`. Si bien esta aproximación ofrece máxima personalización, el coste en tiempo de reconstrucción es inaceptable bajo la misión actual de "Operación Phoenix". Intentar reconstruir este flujo desde cero introduciría una deuda de tiempo significativa y retrasaría la estabilización del proyecto.

**[Arquitectura Propuesta (El Estado de Élite)]**
Se adopta un patrón de delegación canónico, donde un único componente de cliente (`LoginForm.tsx`) actúa como un wrapper configurado para la UI de Supabase.

*   **Componente Unificado Soberano (`src/components/auth/LoginForm.tsx`):**
    *   Este será el único componente para la UI de autenticación.
    *   Aceptará una prop `view: 'sign_in' | 'sign_up'` para renderizar el formulario correcto, adhiriéndose al principio DRY.
    *   Será responsable de configurar la UI de Supabase, incluyendo el `brandTheme` para consistencia visual, los proveedores OAuth, y la lógica de redirección.

*   **Delegación de Lógica:**
    *   La librería `@supabase/auth-ui-react` gestionará internamente el estado del formulario, la validación de campos y la comunicación con la API de autenticación de Supabase.
    *   Esto **elimina la necesidad de las Server Actions personalizadas** `signInWithPasswordAction` y `signUpAction`.

*   **Flujo de Redirección Inteligente:**
    *   El componente leerá el parámetro de búsqueda `next` de la URL.
    *   Construirá una `redirectTo` URL que incluya este parámetro, asegurando que después de un inicio de sesión exitoso, el usuario sea redirigido a la página que intentaba acceder originalmente. El callback `api/auth/callback` gestionará el intercambio final de código por sesión.

*   **Componentes de Apoyo y Eliminación de Deuda:**
    *   `AuthFooter.tsx`: Se mantendrá y será compuesto por las páginas de `login` y `signup` para proporcionar enlaces contextuales ("¿No tienes cuenta?").
    *   **Aparatos Obsoletos:** Esta arquitectura hace que los siguientes aparatos del snapshot actual sean obsoletos y deban ser eliminados:
        *   `src/components/auth/SignUpForm.tsx`
        *   `src/components/auth/PasswordStrengthMeter.tsx`
        *   `src/components/auth/OAuthButtons.tsx` (La UI de Supabase renderiza estos botones a través de la prop `providers`).

**[Contrato de Interacción y Dependencias]**
*   **Dependencias Clave:** `@supabase/auth-ui-react`, `@supabase/auth-ui-shared`.
*   **Aparatos Consumidores:** `src/app/[locale]/auth/login/page.tsx`, `src/app/[locale]/auth/signup/page.tsx`.
*   **Impacto Sistémico:** Esta decisión simplifica drásticamente la arquitectura de autenticación, reduce la superficie de código a mantener y acelera la recuperación del proyecto.

**[Estrategia de Pruebas]**
*   **Pruebas Unitarias:** Se centrarán en los contenedores de página (`login/page.tsx`, `signup/page.tsx`) para verificar que renderizan `LoginForm.tsx` con la prop `view` correcta. No se realizarán pruebas unitarias sobre la UI interna de la librería de Supabase.
*   **Pruebas E2E (Playwright):** Serán la principal herramienta de validación para este flujo. Se crearán pruebas que simulen el viaje completo de un usuario: registro, inicio de sesión y redirección.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Claridad Arquitectónica**: ((Implementada)) Este manifiesto establece una SSoT clara para el flujo de autenticación, eliminando ambigüedades.
 * 2. **Reducción de Deuda Técnica**: ((Implementada)) Identifica proactivamente los aparatos que se vuelven obsoletos, preparando el terreno para su eliminación y simplificación del código base.
 *
 * @subsection Melhorias Futuras
 * 1. **Internacionalización de la UI de Supabase**: ((Vigente)) La librería `@supabase/auth-ui-react` acepta una prop `localization`. Se deben crear los objetos de traducción correspondientes para que los textos internos del componente (ej. "Sign in with...") también sean internacionalizados.
 *
 * =====================================================================
 */
// .docs/espejo/auth/manifesto.md