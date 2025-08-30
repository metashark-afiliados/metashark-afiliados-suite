// .docs/system/005_POTENTIAL_AND_UVP_MANIFEST.md
/**
 * @file .docs/system/005_POTENTIAL_AND_UVP_MANIFEST.md
 * @description Manifiesto de Potencialidades y Propuesta Única de Valor (PUV) v1.0.
 *              Esta es la SSoT que define las capacidades actuales y futuras de
 *              ConvertiKit, sirviendo como una "Wiki" interna del proyecto.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto de Potencialidades y Propuesta Única de Valor (PUV) v1.0

## 1. Visión Estratégica: El Copiloto de Conversión

`ConvertiKit` no es un simple constructor de páginas. Es una **plataforma de inteligencia de marketing** diseñada para actuar como un copiloto estratégico para el marketer de afiliados. Nuestra Propuesta Única de Valor (PUV) es:

> **"Maximizar el ROI del marketing de afiliados transformando el esfuerzo creativo en una ciencia de conversión, a través de una suite de herramientas visuales, colaborativas e impulsadas por IA."**

## 2. Potencialidades Actuales (Capacidades Implementadas)

Estas son las funcionalidades de élite que ya forman el núcleo de la plataforma:

### 2.1. Arquitectura Multi-Tenant y Colaborativa
*   **Capacidad:** Gestión de `Workspaces` aislados, sistema de roles (`owner`, `admin`, `member`, `viewer`, `billing`) y flujo de invitaciones en tiempo real.
*   **Impacto:** Permite a agencias y equipos gestionar múltiples clientes o proyectos de forma segura y organizada desde una única cuenta. Es la base del modelo B2B.

### 2.2. Ecosistema de Publicación Desacoplado
*   **Capacidad:** Separación de `Creations` (el diseño soberano) de `Campaigns` (la instancia publicada en un `Site` con un `slug`).
*   **Impacto:** Flexibilidad arquitectónica masiva. Permite la reutilización de diseños, futuras pruebas A/B (una `Creation` en múltiples `Campaigns`) y una gestión de activos agnóstica al canal de publicación.

### 2.3. Constructor Visual de ÉlITE (`Builder`)
*   **Capacidad:** Un editor visual con gestión de estado de nivel de producción (Zustand con `persist`, `zundo`, `syncTabs`), sistema de bloques dinámicos, edición en vivo y Drag & Drop.
*   **Impacto:** Proporciona una experiencia de creación de contenido sin fricciones, resiliente (cero pérdida de datos) e intuitiva.

### 2.4. Infraestructura de "Personalización Soberana"
*   **Capacidad:** Sistema de tematización basado en variables CSS, `ThemeProvider` e intercambiabilidad de librerías de iconos.
*   **Impacto:** La UI de `ConvertiKit` es un camaleón. Permite re-skins completos y sienta las bases para que los usuarios apliquen sus `Brand Kits` de forma global.

## 3. Potencialidades Futuras (Roadmap de Evolución)

Estas son las funcionalidades latentes y futuras que se construirán sobre la sólida base actual. Están jerarquizadas por impacto y viabilidad.

### 3.1. Nivel 1: Completitud del Núcleo de Producto

*   **1. "Arsenal de Conversión" Completo:**
    *   **Potencialidad:** Implementar la biblioteca completa de bloques (`Header`, `Hero`, `Features`, `Testimonials`, `Footer`) y activar el `SettingsPanel` para una personalización visual total.
    *   **Impacto:** El `Builder` se convierte en una herramienta de creación de landing pages 100% funcional y competitiva.

*   **2. Sistema de Monetización Activo:**
    *   **Potencialidad:** Activar el flujo de suscripciones implementando el webhook de Stripe y las `Server Actions` para `createCheckoutSession` y `createPortalSession`.
    *   **Impacto:** Habilita el modelo de negocio SaaS, permitiendo la generación de ingresos.

*   **3. Gestión de `Brand Kits`:**
    *   **Potencialidad:** Desarrollar la UI para que los usuarios puedan crear y gestionar sus `Brand Kits` (paletas de colores, fuentes, logos).
    *   **Impacto:** Ofrece una característica premium de alto valor, especialmente para agencias, y refuerza la PUV de personalización.

### 3.2. Nivel 2: La Integración de IA (El Copiloto)

*   **1. L.I.A. - Asistente Conversacional Real:**
    *   **Potencialidad:** Reemplazar la simulación actual en `sendMessageToLiaAction` con una integración real a un LLM vía Vercel AI SDK. Implementar el consumo de `user_tokens`.
    *   **Impacto:** Transforma el chat de un placeholder a una herramienta funcional de soporte y generación de ideas.

*   **2. AI Copywriter Pro (Integrado en el Builder):**
    *   **Potencialidad:** Crear una `Server Action` que, dado un contexto (tipo de bloque, producto, audiencia), utilice un LLM para generar y reemplazar texto directamente en los `EditableText` del `Builder`.
    *   **Impacto:** Acelera drásticamente el proceso de creación de contenido, abordando uno de los mayores puntos de dolor de los marketers.

*   **3. Generador de Páginas a partir de Imágenes ("Clone with AI"):**
    *   **Potencialidad:** Implementar una `Server Action` que reciba una URL o una imagen de una landing page existente, la analice con un modelo de visión (como GPT-4 Vision), y genere una estructura de bloques de `Creation` para replicar su diseño.
    *   **Impacto:** Una característica disruptiva que reduce el tiempo de "idea a borrador" a segundos.

### 3.3. Nivel 3: Ecosistema y Optimización

*   **1. Dashboard de Analíticas Predictivas:**
    *   **Potencialidad:** Crear una UI que visualice los datos de `visitor_logs` y `campaigns` (conversiones). Utilizar la IA para analizar estos datos y generar insights accionables (ej. "La campaña X tiene un bajo rendimiento en móviles, sugiere simplificar el Héroe").
    *   **Impacto:** Cumple la promesa de ser un "copiloto estratégico", no solo una herramienta de construcción.

*   **2. Pruebas A/B Nativas:**
    *   **Potencialidad:** Aprovechar la arquitectura `Creation` -> `Campaign`. Permitir que múltiples `Campaigns` (con diferentes slugs o porcentajes de tráfico) apunten a diferentes `Creations` dentro del mismo `Site`.
    *   **Impacto:** Proporciona una funcionalidad de optimización de conversiones de nivel empresarial directamente en la plataforma.

*   **3. Marketplace de Plantillas y Afiliados:**
    *   **Potencialidad:** Desarrollar la funcionalidad para que los usuarios puedan compartir sus `Creations` como plantillas. Implementar el sistema de `affiliate_products` para crear un marketplace interno.
    *   **Impacto:** Crea un ecosistema, fomenta la comunidad y abre nuevas vías de monetización.

---