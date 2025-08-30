// .docs/espejo/functionality/007_AI_SERVICES_DOMAIN_MANIFEST.md
/**
 * @file .docs/espejo/functionality/007_AI_SERVICES_DOMAIN_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto del Dominio "AI Services".
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Dominio "AI Services (L.I.A.)"

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que define el propósito de negocio, la arquitectura técnica, los flujos de lógica y el roadmap de evolución para el dominio de `AI Services`, personificado en el asistente L.I.A. (Legacy Intelligence Assistant). Sirve como la guía de referencia funcional de alto nivel para el diferenciador competitivo clave de ConvertiKit.

## 2. Arquitectura del Contenido
El manifiesto se estructura para proporcionar una visión 360° del dominio:
1.  **Rol Estratégico:** Define la filosofía de "Inteligencia Accionable".
2.  **Funcionalidades Implementadas (Simuladas):** Detalla las capacidades actuales del `LiaChatWidget` y la simulación de respuestas.
3.  **Arquitectura Técnica y de Datos:** Explica el futuro modelo de consumo de tokens y la arquitectura de componentes del frontend.
4.  **Flujos de Lógica de Negocio:** Documenta el flujo crítico de `sendMessageToLiaAction`.
5.  **Roadmap de Evolución:** Especifica las funcionalidades completadas y las próximas a implementar, como la integración real con un LLM y el streaming de respuestas.

## 3. Contrato de API
- **Formato de Entrada:** Requerimientos de negocio y decisiones arquitectónicas de la Constitución.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT funcional para el dominio de AI Services.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Integración con Vercel AI SDK:** Reemplazar la simulación en `sendMessageToLiaAction` con una integración real a un LLM.
 * 2.  **Implementar Consumo de Tokens:** Activar la lógica de verificación y débito de `user_tokens`.
 * 3.  **Streaming de Respuestas:** Refactorizar la `Server Action` y la `LiaChatInterface` para soportar streaming.
 * 4.  **Persistencia de Historial:** Añadir una tabla `chat_histories` para guardar las conversaciones.
 * 5.  **AI Copywriter Pro:** Crear un nuevo dominio funcional para generar textos persuasivos directamente en el `Builder`.
 * 6.  **Contexto Dinámico:** Permitir que el `LiaChatWidget` se abra con un contexto inicial (ej. "Analizar esta campaña") basado en la página actual del usuario.
 * 7.  **Generación de Imágenes con IA:** Implementar una `Server Action` que se integre con un modelo de generación de imágenes (ej. DALL-E, Midjourney) para crear imágenes para las campañas.
 * 8.  **Análisis Predictivo de Conversión:** Desarrollar una `Server Action` que, dado el `content` de una `Creation`, utilice un LLM para predecir su tasa de conversión y ofrecer sugerencias de mejora.
 * 9.  **Búsqueda Semántica en Base de Conocimiento:** Integrar la búsqueda de la Wiki con un modelo de embeddings para permitir a los usuarios hacer preguntas en lenguaje natural.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/functionality/007_AI_SERVICES_DOMAIN_MANIFEST.md