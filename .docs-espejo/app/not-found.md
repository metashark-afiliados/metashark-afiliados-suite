// .docs-espejo/app/not-found.md
/**
 * @file not-found.md
 * @description Documento Espejo y SSoT para el manejador de errores 404 global.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Manejador de Errores 404

## 1. Rol Estratégico y Propósito
Este aparato es la **red de seguridad final** para el enrutamiento de la aplicación. Su única responsabilidad es renderizar una página de error 404 clara y útil cuando un usuario intenta acceder a una ruta que no existe. Debe ser un componente **extremadamente robusto y sin dependencias de cliente**, ya que debe poder renderizarse en cualquier circunstancia.

## 2. Arquitectura del Contenido
1.  **Server Component Puro:** El componente es un `async function` que no contiene la directiva `"use client"` ni utiliza ningún hook de React. Esto garantiza que pueda ser renderizado estáticamente en el servidor durante el build.
2.  **Obtención de Traducciones Segura:** Intenta obtener las traducciones utilizando `getTranslations` de `next-intl/server`.
3.  **Lógica de Fallback Resiliente:** La obtención de traducciones está envuelta en un bloque `try/catch`. Si falla, el componente utiliza un objeto de textos de fallback en inglés predefinidos. Esta resiliencia garantiza que la página 404 se renderice siempre.
4.  **Acciones de Usuario Claras:** Proporciona dos llamadas a la acción claras ("Volver al Inicio" y "Ir al Dashboard") para guiar al usuario de vuelta a una ruta válida.

## 3. Contrato de API
- **Entrada:** Ninguna.
- **Salida:** El JSX completo para la página 404.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Logging de Rutas 404:** La lógica de logging de rutas no encontradas debería residir en el `middleware`, ya que este intercepta todas las peticiones, incluyendo las de assets, proporcionando una observabilidad más completa.
 * 2.  **Sugerencias Inteligentes:** La página podría ser mejorada para analizar la ruta solicitada y sugerir rutas similares que sí existan (ej. "¿Quisiste decir `/dashboard/sites`?").
 * 3.  **Componente `ErrorPageLayout`:** La estructura de la página (layout centrado, icono, etc.) es un patrón reutilizable. Podría ser abstraído a un componente `ErrorPageLayout` genérico para ser usado también por la página 500 (`global-error.tsx`).
 * 4.  **ID de Incidencia:** En caso de un fallo de i18n, se podría generar y mostrar un ID de incidencia único para que el usuario lo reporte al soporte técnico.
 * 5.  **Diseño Personalizado:** La página podría obtener dinámicamente el logo del workspace activo (si el usuario está logueado) para una experiencia más personalizada.
 * 6.  **Pruebas de Accesibilidad (Axe):** Añadir pruebas unitarias con `jest-axe` para validar que la página de error cumple con los estándares WCAG.
 * 7.  **Estado Vacío para Botones:** Si el usuario no está autenticado, el botón "Ir al Dashboard" podría ocultarse o reemplazarse.
 * 8.  **Internacionalización de Fallback:** El objeto de fallback podría contener múltiples idiomas para ser un poco más robusto incluso en caso de fallo de `next-intl`.
 * 9.  **Animaciones Sutiles:** Añadir animaciones de entrada con `framer-motion` para una presentación menos abrupta del error.
 * 10. **Revisión de Contenido por UX Writer:** El contenido textual de la página de error debería ser revisado por un especialista en UX para asegurar que sea lo más claro y útil posible para el usuario.
 * =====================================================================
 */
// .docs-espejo/app/not-found.md