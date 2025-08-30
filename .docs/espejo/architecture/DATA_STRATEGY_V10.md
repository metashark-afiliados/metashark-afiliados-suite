// .docs/espejo/architecture/DATA_STRATEGY_V10.md
/**
 * @file .docs/espejo/architecture/DATA_STRATEGY_V10.md
 * @description Manifiesto de Arquitectura v10.0: El Ecosistema de Datos Hiper-Resiliente.
 *              Esta es la SSoT que define la estrategia holística para la gestión
 *              de datos, estado y seguridad, incorporando un sistema de
 *              sincronización y autoguardado de élite.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 10.0.0
 */
# Manifiesto de Arquitectura v10.0: Ecosistema de Datos Hiper-Resiliente

#### **[Aparato]**
Estrategia Holística de Gestión de Datos, Estado y Seguridad

#### **[Filosofía de Diseño y Propósito]**
La misión es el **desacoplamiento radical entre el estado de la UI y la persistencia en la base de datos**. El propósito es triple:
1.  **Reducir Costos y Carga (Lean Database):** Minimizar el espacio de almacenamiento y el número de consultas.
2.  **Mejorar la Resiliencia y UX (Hyper-Resilient Smart Client):** Crear una experiencia offline-first que **nunca pierde el trabajo del usuario** y se sincroniza inteligentemente a través de todos sus dispositivos.
3.  **Blindar el Sistema (Zero-Trust Security):** Validar y autorizar cada operación en cada capa.

#### **[Arquitectura Propuesta (El Estado de Élite)]**

**Pilar 1: La Base de Datos "Lean" (Codificación y Normalización)**

*   **Lógica:** Implementar "tablas de conversión" (`lookup tables`) para valores repetitivos (`status`, `role`). En las tablas principales, reemplazar columnas `TEXT` por `INTEGER` con claves foráneas a estas tablas de lookup.
*   **Beneficios:** Reducción drástica de espacio, integridad de datos garantizada y rendimiento superior de los índices.

**Pilar 2: El Cliente Inteligente e Hiper-Resiliente (Estado Soberano con Sincronización Automática)**

El estado de la aplicación reside en el cliente y se sincroniza de forma inteligente con la base de datos.

*   **Pilar 2A: Persistencia Local Inmediata (Primera Línea de Defensa)**
    *   **Lógica:** Utilizar el middleware `persist` de `zustand` para guardar el estado crítico (ej. `campaignConfig`) en `localStorage` en cada cambio.
    *   **Beneficios:** Resiliencia instantánea contra cierres de pestaña o fallos del navegador. El estado se rehidrata localmente al volver.

*   **Pilar 2B: Sincronización Automática con la Nube (Segunda Línea de Defensa)**
    *   **Lógica:** Se creará un hook soberano `useAutoSync` que se ejecutará en el layout del Builder. Este hook implementará la siguiente lógica:
        1.  **Suscripción al Estado:** Utilizará `store.subscribe()` para escuchar cualquier cambio en el `campaignConfig`.
        2.  **Debounce de Cambios:** Cada cambio detectado activará una función `debounce` (ej. con un retardo de 2 segundos).
        3.  **Guardado Automático:** La función "debounced" invocará la `Server Action` `updateCreationContentAction` para persistir los cambios en la base de datos.
        4.  **Sincronización por Eventos:** El hook también escuchará eventos del navegador:
            *   **`online`:** Al recuperar la conexión, si hay cambios locales no sincronizados, se fuerza un guardado inmediato.
            *   **`beforeunload`:** Al intentar cerrar la pestaña, se utiliza `navigator.sendBeacon()` para enviar un último guardado de alta fiabilidad.
    *   **Beneficios:** Experiencia multi-dispositivo fluida, minimización de la interacción manual ("Guardar"), y resiliencia ante problemas de conectividad.

*   **Diagrama de Flujo (Mermaid):**
    ```mermaid
    graph TD
        subgraph "Navegador del Cliente"
            A[Usuario edita en UI] --> B{Zustand Store};
            B -- 1. Cambio instantáneo --> D[Guarda en localStorage];
            B -- 2. Suscripción --> E{useAutoSync Hook};
            E -- Dispara --> F(Debounce 2s);
            F -- Finaliza --> G[Invoca Server Action];
            
            subgraph "Eventos del Navegador"
                H[Online Event] --> E;
                I[BeforeUnload Event] --> E;
            end
        end

        subgraph "Servidor"
            G --> H((Base de Datos));
        end
    ```

**Pilar 3: Seguridad de Élite (Zero-Trust)**

*   **Lógica:** La autenticación se gestiona con los `JWT` de Supabase. Cada `Server Action` re-valida la sesión del usuario y sus permisos específicos para el recurso solicitado (`RLS`) antes de ejecutar cualquier operación de escritura.
*   **Beneficios:** Múltiples capas de seguridad. Las políticas de RLS actúan como la última línea de defensa.
---