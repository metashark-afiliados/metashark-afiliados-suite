// .docs/tests/COOKIE_DEBUG_MANIFEST.md
/**
 * @file .docs/tests/COOKIE_DEBUG_MANIFEST.md
 * @description Manifiesto de Pruebas y Guía de Uso para la Cookie de Override `DEBUG_LOCALE`.
 *              Esta es la SSoT para entender, usar y probar la funcionalidad
 *              de forzado de locale para depuración y A/B testing.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
# Manifiesto de Pruebas: Cookie de Override `DEBUG_LOCALE`

### 1. Filosofía y Propósito

La cookie `DEBUG_LOCALE` es una herramienta de élite para la **depuración y el testing de la internacionalización**. Su propósito es permitir a los desarrolladores y al equipo de QA forzar la renderización de la aplicación en un `locale` específico, **ignorando por completo** la lógica de detección automática (URL, cookie `NEXT_LOCALE`, GeoIP, `Accept-Language`).

Esto es invaluable para:
-   Verificar traducciones en un idioma específico sin cambiar la configuración del navegador.
-   Realizar pruebas de regresión visual en diferentes locales rápidamente.
-   Simular la experiencia de un usuario desde una región específica sin usar una VPN.

### 2. Mecanismo de Funcionamiento

La lógica reside exclusivamente en el `i18n Handler` (`src/middleware/handlers/i18n/index.ts`) y opera con la máxima prioridad.

1.  **Detección:** En cada petición, el middleware comprueba la existencia de la cookie `DEBUG_LOCALE`.
2.  **Validación:** Si la cookie existe, su valor se valida contra la lista de `locales` soportados en `src/lib/navigation.ts`. Si el valor no es un `locale` válido, la cookie es ignorada por seguridad.
3.  **Bypass:** Si el valor es válido, toda la lógica de detección de `locale` posterior es omitida. El `defaultLocale` pasado a `next-intl` se establece forzosamente al valor de la cookie.
4.  **Logging:** Cuando el modo de override está activo, se emite un `logger.warn` en la consola del servidor, alertando explícitamente que la detección normal está siendo anulada.

### 3. Guía de Uso (Activación y Desactivación)

La gestión se realiza 100% en las herramientas de desarrollador del navegador.

*   **Para Activar:**
    1.  Abrir las Herramientas de Desarrollador (F12).
    2.  Navegar a la pestaña `Application` (o `Almacenamiento`).
    3.  En la sección `Cookies`, seleccionar `http://localhost:3000`.
    4.  Hacer doble clic en un espacio vacío para crear una nueva cookie:
        *   **Name:** `DEBUG_LOCALE`
        *   **Value:** `pt-BR` (o `en-US`, `es-ES`)
    5.  Recargar la página. La aplicación se renderizará en el idioma forzado.

*   **Para Desactivar:**
    1.  Seguir los pasos 1-3.
    2.  Seleccionar la cookie `DEBUG_LOCALE` y eliminarla (usando la tecla `Supr` o el botón de eliminar).
    3.  Recargar la página. La aplicación volverá al comportamiento de detección normal.

### 4. Estrategia de Pruebas

*   **Pruebas de Integración (Vitest):**
    *   **Escenario 1 (Override Exitoso):** Simular una `NextRequest` que incluya la cookie `DEBUG_LOCALE` con un valor válido (ej. `pt-BR`). Verificar que la respuesta final del middleware `handleI18n` contenga la cabecera `x-app-locale` con el valor `pt-BR`.
    *   **Escenario 2 (Valor Inválido):** Simular una `NextRequest` con `DEBUG_LOCALE=fr-FR` (inválido). Verificar que la cabecera `x-app-locale` contenga el `locale` determinado por la lógica de fallback (ej. `es-ES`), no el de la cookie.

*   **Pruebas End-to-End (Playwright):**
    *   **Escenario 1 (Prueba Visual):** Usar `context.addCookies()` en Playwright para establecer la cookie `DEBUG_LOCALE` antes de navegar a la página. Realizar aserciones visuales o de texto para confirmar que la página se renderizó en el idioma correcto.
    *   **Escenario 2 (Flujo Completo):** Establecer la cookie, navegar, verificar el idioma, eliminar la cookie con `context.clearCookies()`, recargar y verificar que la página vuelve al idioma por defecto.
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Documentación Exhaustiva:** Este manifiesto provee una guía completa y centralizada, mejorando la DX y facilitando la incorporación de nuevos miembros al equipo.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **UI de Gestión en Dev Console:** Crear una sección en el `Dev Console` que permita a los desarrolladores activar/desactivar y cambiar el valor de `DEBUG_LOCALE` a través de una interfaz gráfica.
 *
 * =====================================================================
 */
// .docs/tests/COOKIE_DEBUG_MANIFEST.md