// .docs-espejo/components/layout/LandingHeader.md
/**
 * @file LandingHeader.md
 * @description Documento Espejo y SSoT conceptual para el encabezado de las páginas públicas.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Encabezado de Landing Page

## 1. Rol Estratégico y Propósito
Este aparato es el **punto de navegación principal para los visitantes no autenticados**. Su única responsabilidad es renderizar una cabecera consistente y responsive para todas las páginas públicas (Landing Page, Sobre Nosotros, Blog, etc.), proveyendo enlaces de navegación claros y los puntos de entrada primarios al flujo de autenticación (`/login` y `/signup`).

## 2. Arquitectura del Contenido
1.  **Componente de Presentación Puro:** Es un componente de cliente (`"use client"`) 100% puro. Recibe todo su contenido textual y la estructura de enlaces a través de su contrato de props (`LandingHeaderProps`), lo que lo hace completamente agnóstico al contenido y full internacionalizable.
2.  **Enrutamiento Canónico:** Utiliza el componente `<Link>` de `next-intl/navigation` (importado desde `@/lib/navigation`) para toda la navegación. Los botones de "Sign In" y "Sign Up" son implementados con el patrón `Button asChild`, que delega el control a un `<Link>` anidado. Esto asegura la adhesión a la SSoT de enrutamiento y las mejores prácticas de Next.js para la navegación pre-cargada.
3.  **Diseño Responsivo:** Implementa una navegación principal para escritorio y un menú lateral (`Sheet`) para dispositivos móviles, garantizando una experiencia de usuario de élite en todas las resoluciones.

## 3. Contrato de API
- **Entrada:** `LandingHeaderProps`, un objeto que contiene los textos y la estructura de `navLinks`.
- **Salida:** Un elemento `<header>` completamente funcional y responsive.

/**
 * =====================================================================
 *                           ZONA DE MEJORAS
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Header Pegajoso con Transparencia (`Sticky Header`):** Implementar un `useEffect` con un listener de scroll que añada una clase de fondo (ej. `bg-background/80 backdrop-blur-sm`) solo cuando el usuario se desplaza hacia abajo, haciendo que el header sea transparente inicialmente sobre la sección Hero.
 * 2.  **Indicador de Enlace Activo:** Utilizar el hook `usePathname` para aplicar un estilo visual (ej. `text-primary`) al enlace de navegación que corresponda a la página activa.
 * 3.  **Menú Desplegable para Navegación Compleja:** Si la navegación crece, se podrían introducir sub-menús utilizando el componente `DropdownMenu` para agrupar enlaces relacionados.
 * 4.  **Cierre de `Sheet` en Navegación:** Mejorar la UX móvil haciendo que el menú `Sheet` se cierre automáticamente después de hacer clic en un enlace de navegación.
 * 5.  **Pruebas de Accesibilidad (Axe):** Añadir pruebas unitarias con `jest-axe` para validar que tanto la navegación de escritorio como la móvil cumplen con los estándares de accesibilidad WCAG.
 * 6.  **Logo Configurable:** Aceptar `logoSrc` y `logoAltText` como props para una mayor personalización de la marca.
 * 7.  **Animaciones de Entrada:** Utilizar `framer-motion` para animar la aparición de los elementos del header al cargar la página.
 * 8.  **Reutilización de Menú Móvil:** Abstraer el contenido del `SheetContent` a un componente `MobileNavMenu` si se reutiliza en otros headers.
 * 9.  **Propagación de `aria-current`:** Asegurar que `SmartLink` propague correctamente el atributo `aria-current="page"` para los enlaces activos, mejorando la accesibilidad.
 * 10. **Internacionalización de la Documentación:** Traducir este documento espejo.
 * =====================================================================
 */
// .docs-espejo/components/layout/LandingHeader.md