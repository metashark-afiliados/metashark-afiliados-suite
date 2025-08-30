// .docs-espejo/app/[locale]/page.md
/**
 * @file page.md
 * @description Documento Espejo y SSoT para la página de inicio (HomePage).
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Página de Inicio (HomePage)

## 1. Rol Estratégico y Propósito
Este aparato es el **orquestador de datos principal para la página de inicio pública**. Al ser un **React Server Component (RSC)**, sus responsabilidades son:
1.  Verificar la sesión del usuario y redirigir al dashboard si está autenticado.
2.  Obtener de forma asíncrona todo el contenido textual necesario para sí mismo y para todos sus componentes hijos desde la capa de internacionalización (`next-intl/server`).
3.  Ensamblar los objetos de `props` para cada componente de presentación hijo (`Hero`, `Features`, etc.).
4.  Renderizar la composición de la página, pasando los datos obtenidos como props.

Este patrón desacopla completamente la obtención de datos de la lógica de UI, optimizando el rendimiento al realizar el fetching en el servidor.

## 2. Arquitectura del Contenido
1.  **Guardia de Sesión:** La primera acción del componente es verificar la sesión. Si existe, ejecuta una `redirect`, finalizando el renderizado de forma temprana.
2.  **Obtención de Traducciones:** Utiliza `await getTranslations` para cada namespace de i18n requerido por los componentes de la landing page.
3.  **Construcción de Props:** Crea objetos de props (`heroProps`, `featuresProps`, etc.) que se alinean con los contratos de datos definidos por cada componente hijo.
4.  **Composición de UI:** Renderiza el layout (`LandingHeader`, `main`, `LandingFooter`) y compone los diferentes componentes de sección, inyectando las props preparadas.

## 3. Contrato de API
- **Entrada:** `params: { locale: string }` de la ruta de Next.js.
- **Salida:** El JSX completo y renderizado en el servidor para la página de inicio.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Abstracción de Lógica de Datos:** La lógica de obtención y ensamblaje de `props` podría ser extraída a una función `getHomePageData(locale)` en la capa de datos (`src/lib/data`), haciendo que este componente sea un orquestador de UI aún más puro.
 * 2.  **Contenido Dinámico desde CMS:** Reemplazar la obtención de datos de `testimonials` y `logos` desde los archivos de i18n por una llamada a un CMS Headless o a la base de datos para una gestión de contenido más flexible.
 * 3.  **Streaming de Componentes:** Envolver secciones más pesadas de la página con `<Suspense>` para permitir el streaming de la UI desde el servidor, mejorando el Time to First Byte (TTFB).
 * 4.  **Pruebas A/B de Secciones:** Integrar con un servicio de feature flags para renderizar diferentes versiones de un componente (ej. dos `Hero` distintos) y realizar pruebas A/B.
 * 5.  **Generación de Metadatos Dinámicos:** La función `generateMetadata` podría obtener el título y la descripción desde el namespace de i18n para un SEO completamente localizado.
 * =====================================================================
 */
// .docs-espejo/app/[locale]/page.md