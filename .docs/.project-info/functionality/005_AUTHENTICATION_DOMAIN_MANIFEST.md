// .docs/espejo/functionality/005_AUTHENTICATION_DOMAIN_MANIFEST.md
/**
 * @file .docs/espejo/functionality/005_AUTHENTICATION_DOMAIN_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto del Dominio "Autenticación".
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Dominio "Autenticación"

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que define el ciclo de vida completo del usuario, desde el registro hasta la gestión de la sesión. Sirve como la guía de referencia funcional de alto nivel para el portal de seguridad y el punto de partida de la experiencia del usuario en ConvertiKit.

## 2. Arquitectura del Contenido
El manifiesto se estructura para proporcionar una visión 360° del dominio:
1.  **Rol Estratégico:** Define la filosofía de "Seguro por Defecto, Experiencia Fluida".
2.  **Funcionalidades Implementadas:** Detalla las capacidades actuales del dominio, como el registro multi-método, el onboarding atómico y la gestión de sesión.
3.  **Arquitectura Técnica y Flujos Críticos:** Explica la SSoT de lógica de negocio y detalla los flujos cruciales de registro y callback de OAuth con diagramas de secuencia.
4.  **Roadmap de Evolución:** Especifica las funcionalidades completadas y las próximas a implementar, como Magic Links y MFA.

## 3. Contrato de API
- **Formato de Entrada:** Requerimientos de negocio y decisiones arquitectónicas de la Constitución.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT funcional para el dominio de Autenticación.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Login Sin Contraseña (Magic Links):** Implementar una `Server Action` `sendMagicLinkAction` que utilice `supabase.auth.signInWithOtp()`.
 * 2.  **Autenticación de Múltiples Factores (MFA):** Integrar las capacidades de MFA de Supabase.
 * 3.  **Expansión de Proveedores OAuth:** Añadir soporte para otros proveedores relevantes (ej. GitHub, Microsoft).
 * 4.  **Auditoría y Gestión de Sesiones:** Crear una UI en los ajustes de perfil para que los usuarios puedan ver y revocar sus sesiones activas.
 * 5.  **Protección contra Ataques de Fuerza Bruta:** Implementar `rate limiting` en las `Server Actions` de `signIn` y `requestPasswordReset`.
 * 6.  **Hooks de Autenticación Soberanos:** Crear hooks como `useLogin` y `useSignup` para encapsular la lógica de los formularios y las llamadas a las Server Actions.
 * 7.  **Sincronización de Perfil:** Implementar una `Server Action` `syncUserProfile` que se ejecute en el login para actualizar el perfil del usuario con datos del proveedor OAuth.
 * 8.  **Reautenticación para Acciones Sensibles:** Implementar un flujo que requiera al usuario volver a introducir su contraseña antes de realizar acciones críticas (ej. eliminar un workspace).
 * 9.  **Detección de Anomalías de Login:** Integrar con la tabla `audit_logs` para detectar y alertar sobre patrones de login sospechosos (ej. múltiples IPs en un corto período).
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/functionality/005_AUTHENTICATION_DOMAIN_MANIFEST.md