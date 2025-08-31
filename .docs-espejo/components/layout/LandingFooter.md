// .docs-espejo/components/layout/LandingFooter.md
/**
 * @file LandingFooter.md
 * @description Documento Espejo y SSoT para el pie de página de las páginas públicas,
 *              refactorizado a un componente de presentación puro.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.0.0
 */
# Manifiesto Conceptual: Pie de Página de Landing Page v3.0

## 1. Rol Estratégico y Propósito
Este aparato es el **cierre informativo y de conversión** para los visitantes no autenticados. Sus responsabilidades son:
1.  Reforzar la identidad de marca (`logo`, `slogan`).
2.  Proporcionar navegación secundaria y legal a través de listas de enlaces estructuradas.
3.  Actuar como un punto de captura de leads a través de la composición del `NewsletterForm`.

## 2. Arquitectura del Contenido
1.  **Componente de Presentación 100% Puro:** Es un componente de cliente (`"use client"`) completamente agnóstico al contenido. Ha sido despojado de toda lógica de obtención de datos. Recibe su contenido textual y la estructura de enlaces a través de su contrato de props (`LandingFooterProps`).
2.  **Consumo de Datos Estructurados:** Acepta `productLinks`, `companyLinks`, y `legalLinks` como arrays de `NavLinkItem`, el contrato de datos canónico para la navegación. Esto lo desacopla de la estructura de la fuente de datos original (JSON).
3.  **Composición Atómica:** Compone aparatos atómicos como `SmartLink` y `NewsletterForm`, delegando la lógica específica y adhiriéndose a la "Filosofía LEGO".

## 3. Contrato de API
- **Entrada:** `LandingFooterProps`, un objeto que contiene todos los textos y arrays de enlaces necesarios.
- **Salida:** Un elemento `<footer>` completamente funcional, responsive e internacionalizado, renderizado puramente a partir de sus props.

/**
 * =====================================================================
 *                           ZONA DE MEJORAS
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **`FooterLinkColumn` Atómico:** La lógica para renderizar las columnas de enlaces se repite. Abstraerla a un componente `FooterLinkColumn` que reciba un `title` y un array de `links` mejoraría la adhesión al principio DRY.
 * 2.  **Enlaces a Redes Sociales:** Añadir una sección con iconos que enlacen a los perfiles de redes sociales de la marca. Los enlaces serían gestionados a través de un nuevo array en las props.
 * 3.  **Contenido Dinámico desde CMS:** Para una máxima flexibilidad, los `productLinks`, `companyLinks` y `legalLinks` podrían ser obtenidos desde un CMS Headless en la `HomePage`.
 * 4.  **Efectos de Hover Mejorados:** Añadir microinteracciones sutiles (ej. `transition-colors`) a los enlaces al pasar el cursor para una UX más pulida.
 * 5.  **Pruebas de Accesibilidad (Axe):** Crear un arnés de pruebas unitarias que valide que el pie de página no tiene violaciones de accesibilidad.
 * 6.  **Logo Configurable:** Aceptar `logoSrc` y `logoAltText` como props para una mayor personalización de la marca.
 * 7.  **Animaciones de Entrada:** Utilizar `framer-motion` para animar la aparición del footer al hacer scroll.
 * 8.  **Variantes de Layout:** Introducir una prop `variant: 'default' | 'compact'` para permitir diferentes layouts del footer.
 * 9.  **Internacionalización de la Documentación:** Traducir este documento espejo.
 * 10. **Schema Zod para Props:** Exportar un `LandingFooterPropsSchema` de Zod para validar las props en tiempo de desarrollo.
 * =====================================================================
 */
// .docs-espejo/components/layout/LandingFooter.md