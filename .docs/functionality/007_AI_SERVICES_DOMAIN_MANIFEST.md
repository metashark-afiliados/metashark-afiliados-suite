// .docs/functionality/007_AI_SERVICES_DOMAIN_MANIFEST.md
/**
 * @file .docs/functionality/007_AI_SERVICES_DOMAIN_MANIFEST.md
 * @description Manifiesto Funcional y Arquitectónico del Dominio "AI Services (L.I.A.)" v1.0.
 *              Esta es la SSoT que define la arquitectura para la integración de
 *              Inteligencia Artificial. Reemplaza a la versión anterior.
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Funcional y Arquitectónico: Dominio "AI Services (L.I.A.)"

## 1. Rol Estratégico y Propósito de Negocio
*   **Referencia a la Constitución:** AD-005.
*   El dominio de Servicios de IA es el **diferenciador competitivo clave** de ConvertiKit. Actúa como un **copiloto estratégico** para el marketer.
*   **Filosofía:** "Inteligencia Accionable".

## 2. Funcionalidades Implementadas (Simuladas)
*   **Asistente de Chat Conversacional:** A través del `LiaChatWidget`, los usuarios pueden interactuar con L.I.A.
*   **Gestión de Estado de Chat:** El estado de la conversación es gestionado en el cliente.
*   **Simulación de Respuestas:** La `sendMessageToLiaAction` simula respuestas de la IA basadas en palabras clave.

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

### 3.2. Arquitectura de Componentes (Frontend)
*   **SSoT de Lógica de UI:** Hook `useLiaChatStore` y estado local en `LiaChatInterface`.
*   **Componentes Principales:** `LiaChatWidget`, `LiaChatInterface`.

## 4. Flujos de Lógica de Negocio (Server Actions)
*   **SSoT de Lógica de Negocio:** `src/lib/actions/lia.actions.ts`.
*   **Flujo Crítico (`sendMessageToLiaAction`):** Valida la sesión, (futuro) verifica créditos, procesa la IA (simulado), (futuro) debita créditos, audita y retorna la respuesta.

## 5. Roadmap de Evolución del Dominio
*   **Completado:** Infraestructura de UI para el chat, gestión de estado de UI, Server Action con IA simulada.
*   **Próximos Pasos (Vigente):**
    1.  **Integración con Vercel AI SDK:** Reemplazar la simulación en `sendMessageToLiaAction` con una integración real a un LLM.
    2.  **Implementar Consumo de Tokens:** Activar la lógica de verificación y débito de `user_tokens`.
    3.  **Streaming de Respuestas:** Refactorizar la `Server Action` y la UI para soportar streaming.
    4.  **Persistencia de Historial:** Añadir una tabla `chat_histories`.
    5.  **AI Copywriter Pro:** Crear un nuevo dominio para generar textos directamente en el `Builder`.
// .docs/functionality/007_AI_SERVICES_DOMAIN_MANIFEST.md