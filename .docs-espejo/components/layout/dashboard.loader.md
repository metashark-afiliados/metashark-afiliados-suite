// .docs-espejo/components/layout/dashboard.loader.ts.md
/**
 * @file .docs-espejo/components/layout/dashboard.loader.ts.md
 * @description Documento Espejo y SSoT conceptual para el cargador de datos `dashboard.loader`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
# Manifiesto Conceptual: Cargador de Datos `dashboard.loader`

## 1. Rol Estratégico y Propósito

Este aparato es el **corazón de la hidratación de datos** para todo el entorno autenticado (`/dashboard`). Su única y crítica responsabilidad es actuar como una **factoría de contexto**: obtiene la sesión del usuario, consulta de forma paralela todas las piezas de datos necesarias para el layout global (perfil, workspaces, notificaciones, etc.) y las ensambla en un único objeto de datos (`DashboardLayoutData`). Este objeto es la SSoT que hidrata todos los contextos de React, permitiendo que los componentes de cliente accedan a los datos del servidor sin realizar sus propias peticiones.

## 2. Arquitectura y Flujo de Ejecución

El cargador es una función de servidor que orquesta múltiples consultas a la capa de datos atomizada.

```mermaid
graph TD
    A[DashboardLayout Server Component] -- Llama a --> B(getLayoutData);
    B --> C{getAuthUser};
    C -- No hay usuario --> D[Retorna null, redirige a /login];
    C -- Hay usuario --> E{waitForProfile};
    E -- No hay perfil --> F[Error crítico, signOut, retorna null];
    E -- Hay perfil --> G[Promise.all];
    
    subgraph G [Consulta de Datos Paralela]
        G1[workspacesData.management.getWorkspacesByUserId]
        G2[notifications.getPendingInvitationsByEmail]
        G3[modulesData.getFeatureModulesForUser]
    end

    G --> H{Lógica de Workspace Activo};
    H --> I[Promise.all anidado];
    
    subgraph I [Consulta de Datos de Contexto]
        I1[workspacesData.management.getWorkspaceMembers]
        I2[sitesData.management.getActiveSitesCount]
        I3[campaignsData.management.getPublishedCampaignsCountByWorkspace]
        I4[campaignsData.management.getRecentCampaignsByWorkspaceId]
    end

    I --> J[Ensambla objeto DashboardLayoutData];
    J --> K[Retorna DashboardLayoutData];
    
    subgraph Flujo de Fallo
        B -- Excepción --> L[createPersistentErrorLog];
        L --> M[logger.error];
        M --> N[Retorna null];
    end
3. Contrato de API
Entrada: void
Salida: Promise<DashboardLayoutData | null>
Éxito: Un objeto DashboardLayoutData que cumple con el contrato de DashboardContextProps.
Fallo / No Autenticado: null.
4. Zona de Melhorias Futuras
Cacheo a Nivel de Cargador: Aunque las funciones de datos individuales están cacheadas, la función getLayoutData completa podría ser envuelta en unstable_cache para cachear el objeto de datos ensamblado por petición.
Abstracción de Lógica de Workspace: La lógica para determinar y establecer el activeWorkspace podría ser extraída a un helper atómico para mejorar la cohesión y la testeabilidad.
Implementación de uniqueVisitors30d: El valor actual está codificado como 0. Implementar la consulta real en la capa de datos para obtener esta métrica desde visitor_logs.
Reducción de Consultas: Analizar si algunas de las consultas de Promise.all pueden ser combinadas en una única RPC de PostgreSQL para reducir la sobrecarga de red.
Tipado Estricto de plan_type: El plan_type se maneja como string. Se podría crear un enum o tipo literal para una mayor seguridad de tipos en la función getPlanMaxSites.
Configuración de plan_type Externa: La lógica de getPlanMaxSites está codificada. Mover el mapeo planToMaxSitesMap a un archivo de configuración en src/config para una gestión más fácil.
Sondeo de Perfil con Backoff Exponencial: La función waitForProfile utiliza un retardo fijo. Podría ser mejorada para usar un backoff exponencial, aumentando el tiempo de espera en cada intento.
Contexto Parcial para Onboarding: En el caso de que no haya un workspace activo, se retorna un contexto casi completo pero con activeWorkspace: null. Se podría optimizar para no realizar consultas innecesarias si se sabe que el usuario está en flujo de onboarding.
Mejora de waitForProfile: En lugar de sondear, implementar un mecanismo de pub/sub con Supabase Realtime o Vercel KV para que el trigger de la base de datos emita un evento cuando el perfil esté listo, y esta función pueda esperar ese evento.
Internacionalización de la Documentación: Traducir este documento espejo para equipos de desarrollo multilingües.
// .docs-espejo/components/layout/dashboard.loader.ts.md