// .docs/functionality/011_RESILIENCE_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/functionality/011_RESILIENCE_ARCHITECTURE_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "Resilience" v1.0.
 *              Esta es la SSoT que define la estrategia holística de la plataforma
 *              para garantizar la persistencia de datos y una UX superior,
 *              incluso en condiciones de red adversas (offline-first).
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "Resilience"

## 1. Rol Estratégico y Propósito de Negocio

La resiliencia es una **promesa fundamental** para nuestros usuarios: **su trabajo creativo nunca se perderá**. El propósito de esta arquitectura es proteger los datos del usuario contra cierres de navegador, pérdida de conexión y otros imprevistos, proveyendo una experiencia de usuario que se siente segura, instantánea y fiable.

*   **Filosofía:** "Persistencia por Defecto, Sincronización Inteligente". El sistema guarda proactivamente el trabajo del usuario en el dispositivo (defensa primaria) y luego lo sincroniza con la nube de forma eficiente y no intrusiva (defensa secundaria).

## 2. Arquitectura Técnica de Doble Capa

### 2.1. Capa 1: Persistencia Local Inmediata (Primera Línea de Defensa)

*   **SSoT Técnica:** Middleware `persist` de la librería `zustand`.
*   **Implementación:**
    1.  El `BuilderStore` está envuelto en el middleware `persist`.
    2.  Se configura para guardar el slice `campaignConfig` en el `localStorage` del navegador.
    3.  **Trigger:** Cada mutación en el store de Zustand dispara automáticamente la escritura en `localStorage`.
*   **Flujo de Usuario:**
    1.  Usuario edita un bloque en el `Canvas`.
    2.  La acción de Zustand (`updateBlockProp`) se ejecuta.
    3.  El middleware `persist` intercepta el cambio y actualiza `localStorage` de forma síncrona.
    4.  Si el usuario cierra la pestaña y la vuelve a abrir, el `BuilderStoreProvider` rehidrata el estado desde `localStorage`, restaurando el trabajo al instante.

### 2.2. Capa 2: Sincronización Automática Inteligente (Segunda Línea de Defensa)

*   **SSoT Técnica:** Hook soberano `useAutoSync` (a ser implementado).
*   **Implementación:**
    1.  Un `useEffect` en el hook se suscribe a los cambios del `BuilderStore` (`store.subscribe()`).
    2.  Cada cambio de estado dispara una función `debounce` (ej. 2 segundos).
    3.  Al finalizar el `debounce`, se invoca la `Server Action` `updateCreationContentAction`.
    4.  El hook también escucha eventos del navegador (`online`, `beforeunload`) para forzar una sincronización inmediata y fiable (`navigator.sendBeacon`).
*   **Flujo de Usuario:**
    1.  Usuario termina de editar un texto.
    2.  `useAutoSync` detecta el cambio. Inicia un temporizador de 2 segundos.
    3.  El usuario no realiza más cambios. El temporizador finaliza.
    4.  La `Server Action` se invoca en segundo plano, guardando el trabajo en la base de datos.
    5.  El `StatusBar` se actualiza para mostrar "Guardado".

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

## 3. Flujos de Lógica de Negocio

*   **Onboarding Implícito:** La arquitectura de resiliencia complementa el onboarding atómico. El usuario puede empezar a trabajar inmediatamente después del registro, con la confianza de que su primer diseño está siendo guardado localmente desde el primer clic.
*   **Colaboración Multi-Dispositivo:** La sincronización automática asegura que si un usuario deja su trabajo en el escritorio, puede retomarlo en su portátil exactamente donde lo dejó.

## 4. Roadmap de Evolución del Dominio

*   **Completado:**
    *   Infraestructura de `Zustand` con middlewares de historial y persistencia.
    *   Definición del contrato de `Server Actions` para el guardado.
*   **Próximos Pasos (Vigente):**
    1.  **Implementar `useAutoSync`:** Crear el hook soberano que contenga la lógica de `subscribe`, `debounce` y listeners de eventos del navegador.
    2.  **Integrar `useAutoSync`:** Inyectar el hook en el `BuilderLayout` para que esté activo durante toda la sesión de edición.
    3.  **Refinar `StatusBar`:** Conectar el `StatusBar` a los estados expuestos por `useAutoSync` (`isSyncing`, `lastSynced`) para un feedback de UI preciso.

// .docs/functionality/011_RESILIENCE_ARCHITECTURE_MANIFEST.md