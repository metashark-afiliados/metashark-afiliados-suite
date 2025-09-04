// .docs/espejo/functionality/012_ONBOARDING_DOMAIN_MANIFEST.md
/**
 * @file .docs/espejo/functionality/012_ONBOARDING_DOMAIN_MANIFEST.md
 * @description Documento Espejo y SSoT conceptual para el Manifiesto del Dominio "Onboarding y Guías".
 * @author Raz Podestá - MetaShark Tech & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Conceptual: Dominio "Onboarding y Guías Interactivas"

## 1. Rol Estratégico y Propósito
Este documento es la SSoT canónica que define el propósito de negocio, la arquitectura técnica, los flujos de lógica y el roadmap de evolución para el dominio de `Onboarding & Interactive Guides`. Sirve como la guía de referencia funcional de alto nivel para la experiencia de bienvenida y el futuro sistema de guías interactivas.

## 2. Arquitectura del Contenido
El manifiesto se estructura para proporcionar una visión 360° del dominio:
1.  **Rol Estratégico:** Define la filosofía de "Aprendizaje Contextual y No Bloqueante".
2.  **Arquitectura de Flujo:** Detalla la implementación actual del `WelcomeModal` y la arquitectura futura para las Guías Interactivas, incluyendo el modelo de datos y el flujo con el hook soberano `useInteractiveGuide`.
3.  **Roadmap de Evolución:** Especifica las funcionalidades completadas y las próximas a implementar.

## 3. Contrato de API
- **Formato de Entrada:** Requerimientos de negocio y decisiones arquitectónicas de la Constitución.
- **Formato de Salida:** Documento Markdown que sirve como la SSoT funcional para el dominio de Onboarding y Guías.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 * @subsection Melhorias Futuras
 * 1.  **Diseñar Tabla `user_guides_progress`:** Definir el esquema completo en `schema.sql`.
 * 2.  **Crear Manifiesto de Contenido de Guías:** Documentar los pasos de la primera guía ("Tour de Bienvenida") en un archivo de configuración.
 * 3.  **Implementar `useInteractiveGuide` y `updateGuideProgressAction`:** Desarrollar el núcleo de la lógica de las guías interactivas.
 * 4.  **Integrar Librería de Tour:** Seleccionar e integrar una librería de UI (ej. `react-joyride`) para renderizar los pasos del tour.
 * 5.  **Gamificación del Onboarding:** Conectar la finalización de guías con el sistema de logros (`achievements`) para recompensar a los usuarios.
 * 6.  **Guías Contextuales:** Implementar una lógica que dispare guías específicas basadas en las acciones del usuario (ej. mostrar la guía "Dominios Personalizados" la primera vez que visiten la página de configuración de un sitio).
 * 7.  **Videos Tutoriales Integrados:** Permitir que los pasos de una guía incluyan videos tutoriales embebidos.
 * 8.  **Feedback del Usuario sobre las Guías:** Añadir un pequeño formulario al final de cada guía para que los usuarios puedan calificar su utilidad.
 * 9.  **A/B Testing de Flujos de Onboarding:** Utilizar feature flags para probar diferentes versiones del `WelcomeModal` o de las guías interactivas para ver cuál conduce a una mayor activación del usuario.
 * 10. **Internacionalización de la Documentación:** Traducir este manifiesto para equipos de desarrollo multilingües.
 * =====================================================================
 */
// .docs/espejo/functionality/012_ONBOARDING_DOMAIN_MANIFEST.md

