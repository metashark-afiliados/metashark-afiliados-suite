// .docs-espejo/components/layout/DashboardContextProviders.md
/**
 * @file DashboardContextProviders.md
 * @description Documento Espejo y SSoT para el orquestador de proveedores de contexto.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Orquestador de Proveedores de Contexto

## 1. Rol Estratégico y Propósito
Este aparato es el **fundamento del estado de la UI del dashboard**. Su única responsabilidad es actuar como un **ensamblador de proveedores de contexto**, tomando los datos de sesión cargados en el servidor y haciéndolos disponibles a través de múltiples contextos especializados (`DashboardProvider`, `IconLibraryProvider`, `WorkspaceProvider`) para todo el árbol de componentes de cliente del dashboard.

Esta composición de proveedores es una implementación de élite que permite a los componentes hijos suscribirse únicamente al "slice" de estado que necesitan, optimizando los re-renderizados y adhiriéndose al SRP.

## 2. Arquitectura del Contenido
1.  **Composición Jerárquica:** Los proveedores se anidan en un orden lógico: el `DashboardProvider` (el más global) envuelve al `IconLibraryProvider` y al `WorkspaceProvider`.
2.  **Lógica de Selección de Librería de Iconos:** El componente lee la preferencia `activeIconLibraryId` del perfil del usuario (`value.profile.dashboard_layout`).
3.  **Blindaje de Datos (Type Guard):** Antes de usar la preferencia del usuario, utiliza un guardián de tipo (`isValidIconLibraryId`) para validar que el ID sea uno de los definidos en el `ICON_LIBRARIES_MANIFEST`. Si la preferencia es inválida o no existe, aplica un fallback seguro a la librería por defecto ('lucide'), garantizando la robustez y previniendo errores.

## 3. Contrato de API
- **Entrada:** `children` (el árbol de componentes a envolver) y `value` (los datos cargados por el `dashboard.loader.ts`).
- **Salida:** El árbol de `children` envuelto en todos los proveedores de contexto necesarios.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Proveedores Condicionales**: Si futuros contextos solo fueran necesarios para ciertos roles (ej. un `BillingProvider` para planes `pro`), este componente podría renderizar proveedores de forma condicional basándose en `value.profile`.
 * 2.  **Inyección de `initialState`**: Para contextos que usan `useState` o `useReducer`, este orquestador podría ser el responsable de inyectar el estado inicial cargado desde el servidor.
 * 3.  **Memoización del Valor del Contexto**: El `contextValue` para cada proveedor podría ser memoizado con `useMemo` para optimizar el rendimiento si los datos de entrada son complejos.
 * 4.  **Logging de Contexto**: Añadir `logger.trace` para registrar qué proveedores se están renderizando y con qué valores iniciales, mejorando la observabilidad.
 * 5.  **Pruebas Unitarias de Composición**: Crear un arnés de pruebas que renderice este componente con un hijo de prueba y verifique que todos los contextos (`useDashboard`, `useIconLibrary`, `useWorkspaceContext`) son accesibles y contienen los datos correctos.
 * =====================================================================
 */
// .docs-espejo/components/layout/DashboardContextProviders.md