// .docs-espejo/components/layout/dashboard.loader.md
/**
 * @file dashboard.loader.md
 * @description Documento Espejo y SSoT para el cargador de datos del layout del dashboard.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Cargador de Datos del Layout del Dashboard

## 1. Rol Estratégico y Propósito
Este aparato es el **orquestador de datos soberano** para todo el ecosistema del dashboard. Su única responsabilidad es obtener de forma asíncrona todos los datos globales necesarios para renderizar el layout y poblar los contextos iniciales (`DashboardContext`, etc.). Actúa como una capa de abstracción entre el layout del servidor y las múltiples fuentes de datos.

## 2. Arquitectura del Contenido
1.  **Función Única y Atómica (`getLayoutData`):** Expone una única función que encapsula toda la complejidad de la obtención de datos.
2.  **Obtención de Sesión Resiliente:** Incluye una lógica de sondeo (`waitForProfile`) para manejar la condición de carrera entre la creación de la sesión y la ejecución del trigger de la base de datos que crea el perfil, garantizando un onboarding robusto.
3.  **Obtención de Datos en Paralelo (`Promise.all`):** Obtiene múltiples conjuntos de datos (workspaces, invitaciones, módulos) en paralelo para un rendimiento de carga óptimo.
4.  **Manejo de Errores Centralizado:** Todo el flujo está envuelto en un bloque `try/catch` que registra errores persistentes (`createPersistentErrorLog`) en caso de fallo, devolviendo `null` para que el layout pueda manejar la redirección.
5.  **Contrato de Salida Explícito (`DashboardLayoutData`):** Devuelve un objeto fuertemente tipado que sirve como SSoT para los datos de contexto del dashboard.

## 3. Contrato de API
- **Entrada:** Ninguna.
- **Salida:** Una promesa que resuelve a `DashboardLayoutData | null`.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Abstracción de Métricas a la Capa de Datos:** La lógica para calcular las métricas (`activeSitesCount`, etc.) reside en el loader. Para una arquitectura de élite, esta lógica debería migrar a un nuevo aparato `src/lib/data/metrics/dashboard.data.ts`.
 * 2.  **Tipado de `workspaceMembers`:** La aserción de tipo en `workspaceMembers` es pragmática. La solución de élite es refinar `getWorkspaceMembers` para que su tipo de retorno sea explícito y seguro.
 * 3.  **Optimización de Consulta de Campañas Publicadas:** La subconsulta para obtener los `site_id` dentro de la consulta de campañas publicadas puede ser ineficiente. Una vista de base de datos o una función RPC sería más performante.
 * 4.  **Cacheo de Datos Globales (`unstable_cache`):** La función `getLayoutData` podría ser envuelta en `unstable_cache` para un rendimiento aún mayor.
 * 5.  **Inyección de Dependencias:** Aceptar un cliente Supabase como parámetro opcional para facilitar las pruebas unitarias aisladas.
 * =====================================================================
 */
// .docs-espejo/components/layout/dashboard.loader.md