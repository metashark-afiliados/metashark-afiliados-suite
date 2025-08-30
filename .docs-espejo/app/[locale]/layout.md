// .docs-espejo/app/[locale]/layout.md
/**
 * @file layout.md
 * @description Documento Espejo y SSoT para el Layout Raíz Canónico.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Layout Raíz Canónico

## 1. Rol Estratégico y Propósito
Este aparato es la **raíz del árbol de renderizado de la aplicación**. Su responsabilidad es establecer la estructura HTML fundamental (`<html>`, `<body>`) y actuar como el **orquestador de los proveedores de contexto verdaderamente globales**, aquellos que deben estar disponibles para cada página, ya sea pública o protegida.

## 2. Arquitectura del Contenido
1.  **Estructura HTML Base:** Define el `<html>` con su `lang` y `<body>`, y aplica la fuente global.
2.  **Proveedor de Internacionalización (`NextIntlClientProvider`):** Es el primer proveedor, haciendo que las traducciones estén disponibles para todo el árbol de componentes.
3.  **Proveedor de Temas (`ThemeProvider`):** Envuelve a todos los demás para gestionar el tema visual (claro/oscuro).
4.  **Proveedor de Iconos (`IconLibraryProvider`):** Se inyecta aquí para garantizar que `DynamicIcon` funcione en todas las páginas, incluyendo la landing page. Se inicializa con la librería por defecto (`lucide`), ya que no hay un perfil de usuario para consultar en rutas públicas.
5.  **Seguridad (CSP Nonce):** Lee el `nonce` de las cabeceras de la petición y lo inyecta en la etiqueta `<body>`, una medida de seguridad de élite para la Política de Seguridad de Contenido (CSP).

## 3. Contrato de API
- **Entrada:** `children` (el contenido de la página actual), `params` (para el `locale`).
- **Salida:** El `<html>` completo de la página, con todos los contextos globales inyectados.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Proveedor de `react-query` o SWR:** Si la aplicación introduce fetching de datos en el cliente, el proveedor correspondiente se añadiría aquí.
 * 2.  **Contexto de Sesión Global (Opcional):** Para aplicaciones donde incluso las páginas públicas necesitan saber si hay una sesión, se podría envolver con un `SessionProvider` ligero.
 * 3.  **Detección de Preferencia de Tema del SO:** Mejorar el `ThemeProvider` para que detecte y aplique el tema del sistema operativo del usuario en la primera visita.
 * 4.  **Gestor de Consentimiento de Cookies:** Integrar un proveedor para un banner de consentimiento de cookies, que es un requisito legal en muchas jurisdicciones.
 * 5.  **Proveedor de `framer-motion` (`LazyMotion`):** Para optimizar el tamaño del bundle, se podría envolver `children` con `<LazyMotion features={...}>`.
 * =====================================================================
 */
// .docs-espejo/app/[locale]/layout.md