// .docs-espejo/components/layout/LandingFooter.md
/**
 * @file LandingFooter.md
 * @description Documento Espejo y SSoT para el pie de página de las páginas públicas.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Pie de Página de Landing Page

## 1. Rol Estratégico y Propósito
Este aparato es el **cierre informativo y de conversión** para los visitantes no autenticados. Sus responsabilidades son:
1.  Reforzar la identidad de marca (`logo`, `slogan`).
2.  Proporcionar navegación secundaria y legal (`productLinks`, `companyLinks`, `legalLinks`).
3.  Actuar como un punto de captura de leads secundario a través de un formulario de suscripción a la newsletter.

## 2. Arquitectura del Contenido
1.  **Componente de Presentación Puro:** Es un componente de cliente (`"use client"`) 100% puro. Recibe todo su contenido textual y la estructura de enlaces a través de la capa de i18n, la cual consume de forma soberana.
2.  **Consumo de i18n Canónico:** Utiliza el hook `useTranslations` con el namespace completo y canónico (`components.layout.LandingFooter`), adhiriéndose estrictamente a la arquitectura IMAS para garantizar la seguridad de tipos y la correcta resolución de mensajes.
3.  **Composición Atómica:** Compone el aparato atómico `NewsletterForm`, delegando la lógica del formulario y adhiriéndose a la "Filosofía LEGO".
4.  **Diseño Responsivo:** Utiliza una cuadrícula (grid) de Tailwind CSS que se adapta de 4 columnas en escritorio a 1 columna en dispositivos móviles.

## 3. Contrato de API
- **Entrada:** Ninguna (consume sus propias traducciones).
- **Salida:** Un elemento `<footer>` completamente funcional, responsive e internacionalizado.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Enlaces a Redes Sociales:** Añadir una sección con iconos que enlacen a los perfiles de redes sociales de la marca. Los enlaces serían gestionados desde el archivo de mensajes.
 * 2.  **`FooterLinkColumn` Atómico:** La lógica para renderizar las columnas de enlaces se repite. Abstraerla a un componente `FooterLinkColumn` que reciba un `title` y un array de `links` mejoraría la adhesión al principio DRY.
 * 3.  **Contenido Dinámico desde CMS:** Para una máxima flexibilidad, los `productLinks`, `companyLinks` y `legalLinks` podrían ser obtenidos desde un CMS Headless en lugar de estar codificados en el archivo de mensajes.
 * 4.  **Efectos de Hover Mejorados:** Añadir microinteracciones sutiles (ej. `transition-colors`) a los enlaces al pasar el cursor.
 * 5.  **Pruebas de Accesibilidad (Axe):** Crear un arnés de pruebas unitarias que valide que el pie de página no tiene violaciones de accesibilidad.
 * =====================================================================
 */
// .docs-espejo/components/layout/LandingFooter.md