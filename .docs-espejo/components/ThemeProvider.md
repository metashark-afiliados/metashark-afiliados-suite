// .docs-espejo/components/ThemeProvider.md
/**
 * @file ThemeProvider.md
 * @description Documento Espejo y SSoT para el proveedor de temas.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Proveedor de Temas

## 1. Rol Estratégico y Propósito
Este aparato es un **proveedor de contexto de UI atómico**. Su única responsabilidad es encapsular la librería `next-themes`, proveyendo la funcionalidad de cambio de tema (claro/oscuro/sistema) a todo el árbol de componentes de la aplicación. Actúa como una capa de abstracción, permitiendo que la aplicación dependa de nuestra SSoT (`ThemeProvider`) en lugar de acoplarse directamente a la implementación de un tercero.

## 2. Arquitectura del Contenido
1.  **Wrapper Puro:** El componente es un simple "wrapper" que pasa todas sus props (`...props`) al `NextThemesProvider` subyacente.
2.  **Contrato de API Robusto:** Importa su contrato de props (`ThemeProviderProps`) directamente desde el punto de entrada público de la librería (`next-themes`). Esta es la práctica canónica que garantiza la resiliencia contra futuras actualizaciones de la dependencia.

## 3. Contrato de API
- **Entrada:** `ThemeProviderProps` de `next-themes`.
- **Salida:** El árbol de `children` envuelto en el proveedor de contexto de `next-themes`.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Hook de Tema Personalizado (`useBrandTheme`)**: Abstraer el uso del hook `useTheme` en un hook personalizado (`useBrandTheme`) para centralizar la lógica de negocio futura (ej. analíticas en cambio de tema) sin refactorizar componentes consumidores.
 * 2.  **Persistencia en Base de Datos**: Para usuarios autenticados, la preferencia de tema podría guardarse en la tabla `profiles`. El `ThemeProvider` podría leer esta preferencia al cargar la sesión, sincronizando la experiencia a través de diferentes dispositivos.
 * 3.  **Temas Personalizados por Workspace**: Extender la lógica para permitir que cada workspace tenga su propio tema configurado, que se aplicaría dinámicamente.
 * 4.  **Validación de Props**: Añadir validación en tiempo de desarrollo para las props pasadas, como asegurar que `defaultTheme` sea uno de los temas definidos.
 * 5.  **Integración con `IconLibraryProvider`**: Sincronizar el cambio de tema para que también pueda influir en la paleta de colores de los iconos, si fuera necesario.
 * 6.  **Animación de Transición de Tema**: Utilizar `framer-motion` para animar la transición entre temas, proporcionando un cambio visual más suave.
 * 7.  **Soporte para Múltiples Temas**: Extender la configuración para soportar más de dos temas (ej. "alto contraste").
 * 8.  **Detección de Preferencia de Sistema Mejorada**: Añadir lógica para detectar no solo claro/oscuro, sino también la preferencia de "movimiento reducido".
 * 9.  **API para Inyección de Variables CSS**: Exponer una API a través del contexto que permita a los componentes hijos acceder a las variables CSS del tema activo.
 * 10. **Pruebas Unitarias de Alta Fidelidad**: Crear un arnés de pruebas que simule el cambio de tema y verifique que las clases CSS correctas se aplican al `<html>`.
 * =====================================================================
 */
// .docs-espejo/components/ThemeProvider.md