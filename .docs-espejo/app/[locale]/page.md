// .docs-espejo/app/[locale]/page.md
/**
 * @file page.tsx.md
 * @description Documento Espejo y SSoT conceptual para la página de inicio (HomePage) v13.0,
 *              el "Mega-Orquestador" de datos de alto rendimiento.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 13.0.0
 */
# Manifiesto Conceptual: Página de Inicio (HomePage) v13.0

## 1. Rol Estratégico y Propósito
Este aparato es el **orquestador de datos y ensamblador de UI de alto rendimiento para la página de inicio pública**. Como React Server Component (RSC), sus responsabilidades son:
1.  Actuar como **guardián de sesión**, redirigiendo a los usuarios autenticados al dashboard.
2.  Obtener de forma asíncrona **todo el contenido textual** para sí mismo y para todos sus componentes hijos desde la capa de internacionalización con una **única operación de I/O**.
3.  Actuar como una **capa de adaptación**, transformando los datos del manifiesto de contenido (`landing.json`) a los contratos de `props` específicos que cada componente de presentación hijo espera.
4.  **Ensamblar la UI**, componiendo los diferentes componentes de sección (`LandingHeader`, `Hero`, `Features`, `LandingFooter`, etc.) e inyectando las `props` preparadas.

Este patrón optimizado resuelve el cuello de botella de rendimiento de SSR, desacopla la obtención de datos de la lógica de UI y establece un flujo de datos unidireccional y tipo-seguro.

## 2. Arquitectura del Contenido
1.  **Guardia de Sesión:** La primera acción del componente es verificar la sesión y ejecutar una `redirect` si es necesario.
2.  **Obtención de Traducciones Consolidada:** Utiliza una única llamada `await getTranslations("pages.landing")`.
3.  **Construcción de Props y Adaptación:** Crea objetos de props (`headerProps`, `footerProps`, etc.) que acceden a sus textos a través de la notación de punto (ej. `t('Hero.title')`). Incluye lógica de transformación (ej. `transformLinks`) para adaptar la estructura de datos del JSON a la esperada por las props de los componentes.
4.  **Composición de UI:** Renderiza el layout y compone las diferentes secciones, inyectando las props.

## 3. Contrato de API
- **Entrada:** `params: { locale: string }` de la ruta de Next.js.
- **Salida:** El JSX completo y renderizado en el servidor para la página de inicio, con un tiempo de respuesta inferior a 500ms.

/**
 * =====================================================================
 *                           ZONA DE MEJORAS
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Abstracción de Lógica de Datos:** La lógica de obtención y ensamblaje de `props` podría ser extraída a una función `getHomePageData(locale)` en `src/lib/data/pages/`, haciendo este componente un orquestador de UI aún más puro.
 * 2.  **Contenido Dinámico desde CMS:** Reemplazar la obtención de datos de `testimonials` y `logos` desde i18n por una llamada a un CMS Headless.
 * 3.  **Streaming de Componentes con Suspense:** Envolver secciones más pesadas con `<Suspense>` para mejorar el Time to First Byte (TTFB).
 * 4.  **Pruebas A/B de Secciones:** Integrar con un servicio de feature flags para renderizar diferentes versiones de un componente.
 * 5.  **Generación de Metadatos Dinámicos:** La función `generateMetadata` podría obtener el título y la descripción desde el namespace de i18n para un SEO completamente localizado.
 * 6.  **Carga de Datos Paralelizada:** Si se introducen otras fuentes de datos, las llamadas `await` se deben paralelizar con `Promise.all`.
 * 7.  **Componente `LandingPageLayout`:** Abstraer el `LandingHeader` y `LandingFooter` en un componente de layout específico para páginas públicas.
 * 8.  **Optimización de Imágenes (`priority`):** Auditar el uso de `next/image` para asegurar que las imágenes "above the fold" utilicen la prop `priority`.
 * 9.  **Carga Diferida de Fuentes:** Investigar si fuentes no críticas pueden ser cargadas de forma diferida para mejorar el First Contentful Paint (FCP).
 * 10. **Internacionalización de la Documentación:** Traducir este documento espejo.
 * =====================================================================
 */
// .docs-espejo/app/[locale]/page.md