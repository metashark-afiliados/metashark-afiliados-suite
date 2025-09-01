// .docs-espejo/components/layout/dashboard.loader.md
/**
 * @file dashboard.loader.md
 * @description Documento Espejo y SSoT para el cargador de datos del layout del dashboard.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto Conceptual: Cargador de Datos del Layout del Dashboard

## 1. Rol Estratégico y Propósito
Este aparato es el **orquestador de datos soberano** para todo el ecosistema del dashboard. Su única responsabilidad es obtener de forma asíncrona todos los datos globales necesarios para renderizar el layout y poblar los contextos iniciales, actuando como una capa de abstracción entre el layout del servidor y las múltiples fuentes de datos.

## 2. Arquitectura del Contenido
- **Sincronización con "Lean Database" (AD-002):** La lógica de obtención de datos ha sido completamente alineada.
  - La función `getWorkspaceMembers` (consumida por este loader) ahora realiza un `JOIN` con la `lookup table` `workspace_roles` para obtener el nombre del rol.
  - El `loader` obtiene el `role_id` del miembro activo y lo pasa al contexto.
- **Obtención de Datos en Paralelo (`Promise.all`):** Obtiene múltiples conjuntos de datos en paralelo para un rendimiento de carga óptimo.
- **Manejo de Errores Centralizado:** Todo el flujo está envuelto en un bloque `try/catch` que registra errores persistentes.
- **Contrato de Salida Explícito (`DashboardLayoutData`):** Devuelve un objeto fuertemente tipado que sirve como SSoT para los datos de contexto del dashboard.

## 3. Zona de Mejoras Futuras
1. **Abstracción de Métricas:** La lógica para calcular métricas debería migrar a un módulo de datos `src/lib/data/metrics/dashboard.data.ts`.
2. **Optimización de Consulta de Campañas:** La subconsulta para `publishedCampaignsCount` puede ser ineficiente. Una vista o RPC sería más performante.
3. **Cacheo de Datos (`unstable_cache`):** La función `getLayoutData` podría ser envuelta en `unstable_cache`.
4. **Inyección de Dependencias:** Aceptar un cliente Supabase como parámetro opcional para facilitar las pruebas.
5. **Internacionalización de la Documentación:** Traducir este documento espejo.
// .docs-espejo/components/layout/dashboard.loader.md