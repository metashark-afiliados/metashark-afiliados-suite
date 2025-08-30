// .docs/system/005_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/system/005_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md
 * @description Manifiesto Canónico de Arquitectura de Datos y Estado v1.0.
 *              Esta es la SSoT que define la arquitectura holística para la
 *              persistencia de datos, la gestión de estado y la sincronización.
 *              Expande los Pilares 1 y 2 de la Constitución Arquitectónica y
 *              reemplaza a `.docs/004_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Arquitectura de Datos y Estado v1.0

## 1. Filosofía: "El Cliente es Soberano del Estado, la Base de Datos es la Guardiana de la Verdad"
*   **Referencia a la Constitución:** AD-002, AD-003.
*   Nuestra arquitectura se basa en un desacoplamiento radical. El estado de la aplicación vive en el cliente para una UX instantánea. La base de datos es la SSoT de persistencia a largo plazo. La comunicación entre ambos se realiza exclusivamente a través de Server Actions.

## 2. Los Tres Pilares del Ecosistema de Datos

### 2.1. La Base de Datos "Lean" (El Guardián)
*   **Tecnología:** PostgreSQL (vía Supabase).
*   **Principios de Diseño:**
    1.  **Seguridad por Defecto:** RLS habilitado en todas las tablas.
    2.  **Integridad Relacional:** Uso riguroso de claves foráneas y `lookup tables`.
    3.  **Rendimiento Escalable:** Indexación estratégica y RPCs para lógica transaccional.
    4.  **Normalización (3NF):** Se prioriza para evitar la redundancia.

### 2.2. La Capa de Datos del Servidor (El Intérprete)
*   **SSoT Técnica:** `src/lib/data/`
*   **Funcionalidad:** Es la única capa que puede comunicarse directamente con la base de datos.
    *   **Atomicidad:** Organizada por dominio de negocio (`sites`, `workspaces`).
    *   **Abstracción:** Provee una API de funciones (`getSitesByWorkspaceId`) que oculta la complejidad de SQL.
    *   **Enriquecimiento:** Es responsable de realizar los `JOIN`s. Las capas superiores reciben datos listos para consumir.
    *   **Caching:** Utiliza `unstable_cache` de Next.js para optimizar lecturas.

### 2.3. El Cliente Inteligente e Hiper-Resiliente (El Soberano del Estado)
*   **SSoT Técnica:** Stores de Zustand.
*   **Funcionalidad:**
    1.  **Estado Global:** Zustand gestiona el estado global de la UI.
    2.  **Persistencia Local Inmediata (Defensa Primaria):** El middleware `persist` de Zustand guarda el estado crítico en `localStorage` en cada cambio.
    3.  **Sincronización Automática Inteligente (Defensa Secundaria):** Un hook `useAutoSync` gestiona el autoguardado `debounced` a la base de datos.
// .docs/system/005_DATA_AND_STATE_ARCHITECTURE_MANIFEST.md