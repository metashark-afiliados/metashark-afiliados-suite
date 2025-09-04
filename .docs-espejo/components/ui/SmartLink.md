// .docs-espejo/components/ui/SmartLink.md
/**
 * @file SmartLink.md
 * @description Documento Espejo y SSoT para el componente de enlace inteligente.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Componente `SmartLink`

## 1. Rol Estratégico y Propósito
Este aparato es un **componente de UI atómico y polimórfico**. Su única responsabilidad es renderizar el tipo correcto de enlace (`<Link>` de Next.js para rutas internas, `<a>` para externas o anclas) basándose en la `href` proporcionada. Encapsula esta lógica de decisión, permitiendo a otros componentes usar un único componente de enlace sin preocuparse por la implementación subyacente.

## 2. Arquitectura del Contenido
1.  **Polimorfismo Inteligente:** Detecta el tipo de `href` y renderiza el componente de enlace apropiado (`Link` vs `a`), aplicando automáticamente los atributos de seguridad (`target="_blank"`, `rel="noopener noreferrer"`) para enlaces externos.
2.  **Blindaje contra Errores de Composición:** Envuelve el `label` (`children`) en un componente `RichText` interno. Esto garantiza que siempre se pase un único hijo a `<Link>` o `<a>`, previniendo de forma sistémica el error de runtime `React.Children.only` cuando se utiliza con `t.rich` de `next-intl`.
3.  **API Flexible:** Acepta un `onClick` callback opcional, lo que permite su uso en contextos donde un clic debe disparar tanto una navegación como una acción secundaria (ej. cerrar un menú móvil).

## 3. Contrato de API
- **Entrada:** `NavLinkItem` (`href`, `label`, `className`, `onClick?`).
- **Salida:** Un componente `<Link>` o `<a>` estilizado y funcional.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Indicador de Enlace Activo:** Añadir una prop `activeClassName` que se aplique si la `href` coincide con la ruta actual, obtenida del hook `usePathname`.
 * 2.  **Soporte para `ref`:** Utilizar `React.forwardRef` para permitir que el componente `SmartLink` reenvíe `ref`s al elemento de anclaje subyacente.
 * 3.  **Iconos Opcionales:** Añadir props `leftIcon` y `rightIcon` para permitir la composición de iconos junto al texto del enlace de forma sencilla.
 * 4.  **Validación de `href` con Zod:** En un entorno de desarrollo, se podría añadir una validación con Zod para asegurar que el `href` sea una ruta válida definida en `navigation.ts`.
 * 5.  **Pre-fetching Controlado:** Exponer las props `prefetch` del componente `<Link>` de Next.js para un control más granular sobre el comportamiento de pre-carga.
 * =====================================================================
 */
// .docs-espejo/components/ui/SmartLink.md