// .docs/COOKIE_MANIFEST.md
/**
 * @file .docs/COOKIE_MANIFEST.md
 * @description Manifiesto de Cookies y Única Fuente de Verdad (SSoT).
 *              Este documento audita y define el propósito, ciclo de vida y
 *              mecanismo de cada cookie utilizada en la aplicación ConvertiKit.
 *              Es una herramienta esencial para la depuración, seguridad y
 *              cumplimiento de normativas de privacidad.
 * @author Raz Podestá
 * @version 1.0.0
 */

# Manifiesto de Cookies de ConvertiKit v1.0

## 1. Filosofía de Gestión de Cookies

Nuestra estrategia de cookies se basa en el **principio de mínima necesidad**. Solo utilizamos cookies que son estrictamente necesarias para la funcionalidad principal de la aplicación, la seguridad y la mejora de la experiencia del usuario. Todas las cookies son gestionadas de forma segura, con los flags `HttpOnly` y `SameSite` aplicados siempre que es posible.

## 2. Cookies Propias (Gestionadas por Nuestra Aplicación)

| Nombre de la Cookie     | Propietario / Mecanismo                | Propósito                                                                                                                              | Tipo        | `HttpOnly` | `SameSite` | Duración         |
| ----------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | ---------- | ---------------- |
| `active_workspace_id`   | `workspaces.actions.ts`                | **CRÍTICA:** Almacena el UUID del workspace activo del usuario. Es leída por el `DashboardLayout` y los guardianes de seguridad para establecer el contexto de la sesión. | Funcional   | ✅ Sí      | `Lax`      | Sesión           |
| `metashark_session_id`  | `middleware/handlers/telemetry`        | **Telemetría:** Identificador de sesión anónimo para agrupar las interacciones de un visitante. Se establece en la primera visita.         | Analítica   | ✅ Sí      | `Lax`      | 1 Año            |
| `NEXT_LOCALE_CHOSEN`    | `LanguageSwitcher.tsx`, `ChooseLanguagePage` | **Internacionalización (i18n):** Almacena la preferencia de idioma explícita del usuario. Sobrescribe la detección automática.         | Preferencia | ❌ No      | `Lax`      | 1 Año            |
| `NEXT_LOCALE`           | `next-intl/middleware` (Automática)    | **Internacionalización (i18n):** Almacenada por `next-intl` para recordar el último `locale` detectado o visitado. Utilizada para la redirección inicial. | Funcional   | ❌ No      | `Lax`      | Sesión / Persist. |

## 3. Cookies de Terceros (Gestionadas por Librerías)

| Nombre de la Cookie (Patrón) | Propietario / Mecanismo        | Propósito                                                                                                                                                                         | Tipo      | `HttpOnly` | `SameSite` | Duración         |
| ---------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- | ---------- | ---------------- |
| `sb-<project_ref>-auth-token`| `@supabase/ssr`                | **AUTENTICACIÓN:** Cookie principal de sesión. Contiene el JWT (Access Token y Refresh Token) del usuario. Es el pilar de la seguridad y persistencia de la sesión.                     | Esencial  | ✅ Sí      | `Lax`      | Config. Supabase |
| `sb-csrf`                    | `@supabase/ssr`                | **SEGURIDAD:** Almacena un token CSRF para proteger contra ataques de falsificación de solicitudes entre sitios en las interacciones con la API de Supabase.                             | Seguridad | ✅ Sí      | `Strict`   | Sesión           |
| `next-auth.session-token`    | `next-auth` (Si se usara)      | *Actualmente no usada.* Si se integrara `next-auth`, esta cookie almacenaría el token de sesión.                                                                                     | Esencial  | ✅ Sí      | `Lax`      | Config. NextAuth |

## 4. Análisis y Observaciones

*   **Seguridad:** El uso de `HttpOnly` en las cookies de sesión (`sb-*-auth-token`, `active_workspace_id`) es una práctica de élite, ya que previene su acceso a través de JavaScript del lado del cliente, mitigando ataques XSS.
*   **Privacidad:** Las cookies de telemetría (`metashark_session_id`) no almacenan información de identificación personal (PII). La vinculación con un `user_id` ocurre en la base de datos, del lado del servidor.
*   **UX:** Las cookies de `locale` (`NEXT_LOCALE_CHOSEN`, `NEXT_LOCALE`) son cruciales para proporcionar una experiencia de usuario consistente y localizada entre sesiones.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Documentación de Observabilidad**: ((Implementada)) Este manifiesto proporciona una visibilidad completa sobre el almacenamiento de estado en el cliente, una pieza fundamental de la documentación del proyecto.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración con Política de Privacidad**: ((Vigente)) Este manifiesto debe ser la fuente de verdad para la sección de "Uso de Cookies" en la página de Política de Privacidad. Se podría crear un script que genere parte de esa página a partir de este archivo.
 *
 * =====================================================================
 */
// .docs/COOKIE_MANIFEST.md