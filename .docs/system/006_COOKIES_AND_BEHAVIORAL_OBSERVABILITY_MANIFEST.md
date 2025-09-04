// .docs/system/006_COOKIES_AND_BEHAVIORAL_OBSERVABILITY_MANIFEST.md
/**
 * @file .docs/system/006_COOKIES_AND_BEHAVIORAL_OBSERVABILITY_MANIFEST.md
 * @description Manifiesto de Cookies y Observabilidad del Comportamiento v2.0.
 *              Esta es la SSoT que define la estrategia completa de gestión de
 *              cookies y la arquitectura para el tracking de eventos de usuario.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 2.0.0
 */
# Manifiesto de Cookies y Observabilidad del Comportamiento v2.0

## 1. Filosofía: "Privacidad por Diseño, Observabilidad por Intención"

Nuestra estrategia se basa en dos pilares:
1.  **Mínima Huella:** Solo utilizamos cookies estrictamente necesarias para la funcionalidad y seguridad, siendo transparentes sobre su propósito.
2.  **Full Observability:** Diseñamos nuestra arquitectura para permitir un futuro análisis detallado del comportamiento del usuario, lo que nos permitirá optimizar la plataforma basándonos en datos reales, siempre respetando la privacidad del usuario.

## 2. Inventario de Cookies Actuales

| Nombre de la Cookie     | Propietario / Mecanismo                | Propósito                                                                      | Tipo        | `HttpOnly` | Duración |
| ----------------------- | -------------------------------------- | ------------------------------------------------------------------------------ | ----------- | ---------- | -------- |
| `sb-<...>-auth-token`   | `@supabase/ssr`                        | **AUTENTICACIÓN:** Contiene el JWT de sesión.                                    | Esencial    | ✅ Sí      | Sesión   |
| `active_workspace_id`   | `workspaces.actions.ts`                | **CONTEXTO:** Almacena el ID del workspace activo.                               | Funcional   | ✅ Sí      | Sesión   |
| `metashark_session_id`  | `middleware/handlers/telemetry`        | **TELEMETRÍA:** ID de sesión anónimo.                                            | Analítica   | ✅ Sí      | 1 Año    |
| `NEXT_LOCALE`           | `next-intl/middleware`                 | **i18n:** Almacena la preferencia de idioma del usuario.                         | Preferencia | ❌ No      | 1 Año    |
| `DEBUG_LOCALE`          | Manual (Dev Tools)                     | **DEBUGGING:** Permite forzar un locale específico.                              | Desarrollo  | ❌ No      | Manual   |

---

## 3. Arquitectura Futura: Observabilidad del Comportamiento del Usuario

Para lograr una `Full Observability`, implementaremos un sistema de tracking de eventos del lado del cliente. La arquitectura está diseñada para ser aditiva y no intrusiva.

### 3.1. La Cookie de Tracking (`ck_user_events`)

*   **Propósito:** Almacenar un historial de eventos significativos del usuario durante su sesión.
*   **Contenido:** Un objeto JSON serializado que contendrá un array de eventos.
    *   **Ejemplo de Evento:** `{ "event": "video_played", "timestamp": 1672531200, "videoId": "xyz", "duration": 30 }`
*   **Tipo:** Analítica.
*   **HttpOnly:** ❌ No. Debe ser accesible por JavaScript del cliente.
*   **Duración:** Sesión.

### 3.2. El "Event Tracker" (`src/lib/services/event-tracker.service.ts`)

*   **Propósito:** Un servicio de cliente atómico y centralizado responsable de registrar eventos.
*   **Funcionalidad:**
    1.  **`trackEvent(eventName, payload)`:**
        *   Lee la cookie `ck_user_events`.
        *   Añade el nuevo evento al array.
        *   Vuelve a escribir la cookie con los datos actualizados.
    2.  **"Beacon" de Sincronización:** En eventos clave (ej. cierre de pestaña `beforeunload`, o cada 60 segundos), una función `syncEvents()` enviará el contenido de la cookie a una nueva `Server Action` (`logUserBehaviorAction`) que persistirá los datos en una nueva tabla `user_behavior_logs`.

### 3.3. Integración en la Arquitectura

*   **Diagrama de Flujo (Mermaid):**
    ```mermaid
    graph TD
        subgraph "Cliente (Navegador)"
            A[Usuario interactúa (ej. ve video)] --> B{Componente de Video};
            B -- Llama a --> C[event-tracker.service.ts];
            C -- Escribe en --> D(Cookie: ck_user_events);
        end
        
        subgraph "Sincronización Periódica / Cierre"
             E[Timer / 'beforeunload' event] --> F[event-tracker.service.ts];
             F -- Invoca --> G[logUserBehaviorAction];
        end
        
        subgraph "Servidor"
            G -- Escribe en --> H((db.user_behavior_logs));
        end
    ```

### 3.4. Potencialidades y Casos de Uso

*   **Análisis de Embudos (Funnels):** Entender en qué paso del `Builder` los usuarios abandonan el proceso.
*   **Mapas de Calor de Interacción:** Identificar qué `ActionDockButton`s son los más utilizados.
*   **Medición de Engagement:** Rastrear cuánto tiempo pasan los usuarios en una página o viendo un video tutorial.
*   **Optimización de UX:** Detectar patrones de "rage clicks" o confusión en la interfaz.

// .docs/system/006_COOKIES_AND_BEHAVIORAL_OBSERVABILITY_MANIFEST.md