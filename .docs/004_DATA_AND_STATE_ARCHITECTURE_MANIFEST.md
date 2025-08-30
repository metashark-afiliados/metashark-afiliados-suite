// .docs/004_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/004_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md
 * @description Manifiesto Canónico de Arquitectura de Datos y Estado v1.0.
 *              Esta es la Única Fuente de Verdad (SSoT) definitiva que define la
 *              arquitectura holística para la persistencia de datos, la gestión
 *              de estado en el cliente y la sincronización entre ambos.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Arquitectura de Datos y Estado v1.0

## 1. Filosofía: "El Cliente es Soberano del Estado, la Base de Datos es la Guardiana de la Verdad"

Nuestra arquitectura se basa en un desacoplamiento radical. El **estado de la aplicación vive y respira en el cliente** para una experiencia de usuario instantánea y resiliente. La **base de datos actúa como la SSoT de persistencia a largo plazo**, garantizando la integridad, seguridad y consistencia de los datos. La comunicación entre ambos se realiza exclusivamente a través de Server Actions.

## 2. Los Tres Pilares del Ecosistema de Datos

### Pilar 2.1: La Base de Datos "Lean" (El Guardián)

*   **Tecnología:** PostgreSQL (vía Supabase).
*   **Principios de Diseño:**
    1.  **Seguridad por Defecto (Zero-Trust):** RLS habilitado en todas las tablas. El acceso se deniega por defecto.
    2.  **Integridad Relacional Absoluta:** Uso riguroso de claves foráneas, `CHECK constraints` y `lookup tables` (en lugar de `ENUM`s) para garantizar que los datos sean siempre válidos.
    3.  **Rendimiento Escalable:** Indexación estratégica, uso de vistas materializadas para consultas complejas y ejecución de lógica transaccional a través de RPCs.
    4.  **Normalización (3NF):** Se prioriza la normalización para evitar la redundancia, con desnormalizaciones estratégicas y justificadas para optimizar lecturas críticas.

### Pilar 2.2: La Capa de Datos del Servidor (El Intérprete)

*   **SSoT Técnica:** `src/lib/data/`
*   **Funcionalidad:** Es la única capa de la aplicación que tiene permitido comunicarse directamente con la base de datos.
    *   **Atomicidad:** Organizada por dominio de negocio (`sites`, `workspaces`, etc.).
    *   **Abstracción:** Provee una API de funciones asíncronas (`getSitesByWorkspaceId`) que oculta la complejidad de las consultas SQL.
    *   **Enriquecimiento:** Es responsable de realizar los `JOIN`s necesarios para enriquecer los datos (ej. obtener el nombre de un `status` a partir de su `status_id`). Las capas superiores reciben datos listos para consumir.
    *   **Caching:** Utiliza `unstable_cache` de Next.js para cachear las consultas a nivel de request, minimizando las llamadas a la base de datos.

### Pilar 2.3: El Cliente Inteligente e Hiper-Resiliente (El Soberano del Estado)

*   **SSoT Técnica:** Stores de Zustand (`src/lib/hooks/` y `src/lib/builder/core/`).
*   **Funcionalidad:**
    1.  **Estado Global:** Zustand gestiona todo el estado global de la UI (estado del dashboard, modales, etc.).
    2.  **Persistencia Local Inmediata (Primera Línea de Defensa):** El middleware `persist` de Zustand guarda automáticamente el estado crítico (ej. `campaignConfig` del Builder) en `localStorage` en cada cambio. Esto garantiza la recuperación del trabajo del usuario ante cierres inesperados.
    3.  **Sincronización Automática Inteligente (Segunda Línea de Defensa):** Un hook soberano (`useAutoSync`) se suscribe a los cambios del store. Utiliza `debounce` para agrupar cambios y `navigator.sendBeacon` para un último guardado fiable, sincronizando el estado con la base de datos de forma eficiente y resiliente.

## 3. Diagrama de Flujo de Datos Holístico

```mermaid
graph TD
    subgraph "Navegador del Cliente"
        A[UI Components] <-->|Lee/Escribe| B{Zustand Store};
        B -- Persistencia Inmediata --> C[LocalStorage];
        B -- Sincronización Inteligente --> D[Server Actions];
    end
    
    subgraph "Servidor (Vercel)"
        D -- Invoca --> E[Capa de Datos (`/lib/data/`)];
        E -- Consulta --> F((Base de Datos Supabase));
    end

    F -- RLS / Triggers / RPCs --> E;
    E -- Retorna Datos Enriquecidos --> D;
    D -- Retorna ActionResult --> B;
    ---
    