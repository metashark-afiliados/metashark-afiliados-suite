// .docs/functionality/007_AI_SERVICES_MANIFEST.md
/**
 * @file .docs/functionality/007_AI_SERVICES_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "AI Services (L.I.A.)" v1.0.
 *              Esta es la SSoT que define el propósito, la arquitectura y la
 *              lógica de negocio para la integración de Inteligencia Artificial
 *              en ConvertiKit, centrada en el asistente L.I.A.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "AI Services (L.I.A.)"

## 1. Rol Estratégico y Propósito de Negocio

El dominio de Servicios de IA es el **diferenciador competitivo clave** de `ConvertiKit`. Su propósito es actuar como un **copiloto estratégico** para el marketer, automatizando tareas creativas, proporcionando análisis predictivos y acelerando el flujo de trabajo desde la idea hasta la conversión. L.I.A. (Legacy Intelligence Assistant) es la personificación de esta capacidad.

*   **Filosofía:** "Inteligencia Accionable". La IA no es una demostración técnica; es una herramienta pragmática que genera resultados de negocio tangibles, como mejor copy, tasas de conversión más altas y un tiempo de lanzamiento más rápido.

## 2. Funcionalidades Implementadas (Simuladas)

*   **Asistente de Chat Conversacional:** A través del `LiaChatWidget`, los usuarios pueden interactuar con L.I.A. en una interfaz de chat modal.
*   **Gestión de Estado de Chat:** El estado de la conversación es gestionado en el cliente (`useState`), permitiendo un historial de chat por sesión.
*   **Simulación de Respuestas:** La `sendMessageToLiaAction` actualmente contiene una lógica de `if/else` que simula respuestas de la IA basadas en palabras clave en el mensaje del usuario, permitiendo el desarrollo y prueba de la UI sin una conexión real a un LLM.

## 3. Arquitectura Técnica y de Datos

### 3.1. Modelo de Entidad-Relación (Base de Datos)

*   **SSoT de Datos:** Tabla `user_tokens`.
*   **Diagrama de Flujo de Consumo de Tokens (Futuro):**
    ```mermaid
    sequenceDiagram
        participant Client as UI
        participant Server as Server Action
        participant DB as PostgreSQL DB
        participant LLM as Large Language Model

        Client->>Server: sendMessageToLiaAction(message)
        Server->>DB: Leer `balance` de `user_tokens`
        alt Saldo Suficiente
            Server->>LLM: Enviar `prompt`
            LLM-->>Server: Recibir respuesta de IA
            Server->>DB: Debitar `balance` de `user_tokens`
            Server-->>Client: ActionResult { success: true, data: AI_Response }
        else Saldo Insuficiente
            Server-->>Client: ActionResult { success: false, error: 'ai_credits_depleted' }
        end
    ```
*   **Descripción:** La tabla `user_tokens` rastrea el saldo de créditos de IA de cada usuario. Cada interacción significativa con un servicio de IA (enviar un mensaje, generar una imagen) consumirá una cantidad predefinida de tokens.

### 3.2. Arquitectura de Componentes (Frontend)

*   **SSoT de Lógica de UI (Estado):** Hook soberano `useLiaChatStore` (para visibilidad) y estado local en `LiaChatInterface` (para la conversación).
*   **Componentes Principales:**
    *   `LiaChatWidget`: El botón de acción flotante que orquesta la visibilidad del chat a través de `useLiaChatStore`.
    *   `LiaChatInterface`: El componente modal que contiene la UI completa del chat, gestiona el historial de la conversación y se comunica con la `Server Action`.

## 4. Flujos de Lógica de Negocio (Server Actions)

*   **SSoT de Lógica de Negocio:** `src/lib/actions/lia.actions.ts`.
*   **Flujo Crítico (`sendMessageToLiaAction`):**
    1.  **Autenticación y Validación:** Valida la sesión del usuario y el `message` con Zod.
    2.  **(Futuro) Verificación de Créditos:** Consulta la tabla `user_tokens` para asegurar que el usuario tiene suficientes créditos.
    3.  **Procesamiento de IA (Simulado):** Aplica la lógica de `if/else` para generar una respuesta.
    4.  **(Futuro) Débito de Créditos:** Actualiza el `balance` en la tabla `user_tokens`.
    5.  **Auditoría:** Registra la interacción en `audit_logs`.
    6.  **Retorno:** Devuelve la respuesta de la IA (`LiaChatMessage`) al cliente.

## 5. Roadmap de Evolución del Dominio

*   **Completado:**
    *   Infraestructura de UI para el chat (`LiaChatWidget`, `LiaChatInterface`).
    *   Gestión de estado de UI (`useLiaChatStore`).
    *   Server Action con lógica de IA simulada.
*   **Próximos Pasos (Vigente):**
    1.  **Integración con Vercel AI SDK:** Reemplazar la simulación en `sendMessageToLiaAction` con una integración real a un LLM (ej. OpenAI GPT-4, Llama) a través del Vercel AI SDK.
    2.  **Implementar Consumo de Tokens:** Activar la lógica de verificación y débito de `user_tokens` en la `Server Action`.
    3.  **Streaming de Respuestas:** Refactorizar la `Server Action` y la `LiaChatInterface` para soportar streaming, mostrando la respuesta de la IA palabra por palabra para una UX de élite.
    4.  **Persistencia de Historial:** Añadir una tabla `chat_histories` para guardar las conversaciones y permitir a los usuarios retomarlas entre sesiones.
    5.  **AI Copywriter Pro:** Crear un nuevo dominio funcional que utilice la misma infraestructura de IA para generar textos persuasivos directamente en el `Builder`.

// .docs/functionality/007_AI_SERVICES_MANIFEST.md