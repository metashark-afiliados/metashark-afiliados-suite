// .docs-espejo/app/dashboard/layout.md
/**
 * @file layout.md
 * @description Documento Espejo y SSoT para el layout del dashboard.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Layout del Dashboard

## 1. Rol Estratégico y Propósito
Este aparato es el **orquestador de servidor y guardián de seguridad** para todo el ecosistema del dashboard (`/dashboard/*`). Sus responsabilidades son:
1.  **Invocar al Cargador de Datos:** Delegar toda la lógica de obtención de datos al `dashboard.loader.ts`.
2.  **Actuar como Guardián de Seguridad:** Verificar el resultado del cargador. Si es `null` (sesión inválida), ejecuta una `redirect` a la página de login.
3.  **Ensamblar la UI de Cliente:** Si la sesión es válida, ensambla el `DashboardLayoutClient` y los `DashboardContextProviders`, inyectando los datos obtenidos para que estén disponibles en todo el árbol de componentes del cliente.

## 2. Arquitectura del Contenido
1.  **Desacoplamiento Total:** Este componente no contiene lógica de acceso a base de datos ni de gestión de estado. Es un orquestador puro que sigue el patrón "Cargar Datos, Luego Renderizar".
2.  **Observabilidad Completa:** Cada punto de decisión crítico (inicio de orquestación, resultado de la carga de datos, renderizado final) es registrado con `logger`, proporcionando una trazabilidad completa del flujo de renderizado del lado del servidor.

## 3. Contrato de API
- **Entrada:** `children` (el contenido de la página actual que se está renderizando dentro del dashboard).
- **Salida:** El JSX del layout del dashboard completo, con los contextos ya poblados, o una redirección.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **`ErrorBoundary` de Servidor:** Envolver `children` en un `ErrorBoundary` de React para capturar errores de renderizado inesperados en las páginas hijas y mostrar una UI de fallback controlada.
 * 2.  **Página de Carga Global del Dashboard (`loading.tsx`):** Crear un archivo `loading.tsx` a este nivel para mostrar un esqueleto de alta fidelidad del layout del dashboard mientras `getLayoutData` se está ejecutando, mejorando el LCP y la UX percibida.
 * 3.  **Página de Error Global del Dashboard (`error.tsx`):** Crear un archivo `error.tsx` para manejar los errores que `getLayoutData` podría lanzar, mostrando una UI de error amigable en lugar de la página de error por defecto de Next.js.
 * 4.  **Parámetros de `loader` Dinámicos:** Si en el futuro se necesitan datos específicos de la ruta en el `loader` (ej. para un sub-dashboard), se podrían pasar los `params` de la página a `getLayoutData`.
 * 5.  **Inyección de Dependencias para Pruebas:** Refactorizar para permitir la inyección de una versión simulada de `getLayoutData` para pruebas de integración más sencillas.
 * =====================================================================
 */
// .docs-espejo/app/dashboard/layout.md