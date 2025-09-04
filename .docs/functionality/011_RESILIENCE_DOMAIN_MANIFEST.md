// .docs/functionality/011_RESILIENCE_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/011_RESILIENCE_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Resilience" v1.0.
 *              Esta es la SSoT que define la estrategia holística para garantizar
 *              la persistencia de datos (offline-first). Reemplaza a la versión anterior.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Resilience"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-003.
*   La resiliencia es una **promesa fundamental** para nuestros usuarios: **su trabajo creativo nunca se perderá**. El propósito es proteger los datos del usuario contra cierres de navegador, pérdida de conexión y otros imprevistos.
*   **Filosofía:** "Persistencia por Defecto, Sincronización Inteligente".

## 2. Arquitectura Técnica de Doble Capa

### 2.1. Capa 1: Persistencia Local Inmediata (Primera Línea de Defensa)
*   **SSoT Técnica:** Middleware `persist` de la librería `zustand`.
*   **Implementación:** El `BuilderStore` está envuelto en el middleware `persist`, configurado para guardar el slice `campaignConfig` en el `localStorage` del navegador en cada mutación.
*   **Flujo:** `Usuario edita` -> `Acción de Zustand` -> `Middleware 'persist'` -> `Escritura síncrona en localStorage`.

### 2.2. Capa 2: Sincronización Automática Inteligente (Segunda Línea de Defensa)
*   **SSoT Técnica:** Futuro hook soberano `useAutoSync`.
*   **Implementación:** Un `useEffect` en el hook se suscribe a los cambios del `BuilderStore` (`store.subscribe()`). Cada cambio dispara una función `debounce`. Al finalizar, se invoca la `Server Action` `updateCreationContentAction`. El hook también escucha eventos del navegador (`online`, `beforeunload`) para forzar una sincronización.
*   **Flujo:** `Usuario edita` -> `useAutoSync detecta cambio` -> `Inicia debounce` -> `Finaliza debounce` -> `Invoca Server Action en segundo plano`.

*   **Diagrama de Arquitectura (Mermaid):**
    ```mermaid
    graph TD
        subgraph "Navegador del Cliente"
            A[Usuario edita en UI] --> B{Zustand Store};
            B -- 1. Síncrono (Capa 1) --> C[Middleware 'persist' --> localStorage];
            B -- 2. Asíncrono (Capa 2) --> D{Hook 'useAutoSync'};
            D -- Debounce 2s --> E[Invoca Server Action];
        end
        
        subgraph "Servidor"
            E --> F((Base de Datos));
        end
    ```

## 3. Roadmap de Evolución del Dominio
*   **Completado:** Infraestructura de `Zustand` con middleware de persistencia.
*   **Próximos Pasos (Vigente):**
    1.  **Implementar `useAutoSync`:** Crear el hook soberano que contenga la lógica de `subscribe`, `debounce` y listeners de eventos.
    2.  **Integrar `useAutoSync`:** Inyectar el hook en el `BuilderLayout`.
    3.  **Refinar `StatusBar`:** Conectar el `StatusBar` a los estados expuestos por `useAutoSync`.
// .docs/functionality/011_RESILIENCE_DOMAIN_MANIFEST.md