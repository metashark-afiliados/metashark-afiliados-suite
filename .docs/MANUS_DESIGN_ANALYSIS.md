// .docs/MANUS_DESIGN_ANALYSIS.md
/**
 * @file .docs/MANUS_DESIGN_ANALYSIS.md
 * @description Manifiesto de Análisis y Blueprint de Diseño de Élite.
 *              Este documento es el resultado de una auditoría profunda de la
 *              aplicación "Manus". Extrae sus principios de diseño visual,
 *              estrategias de branding y patrones de animación para servir como
 *              guía e inspiración en la reconstrucción y perfeccionamiento de
 *              la UI/UX de `metashark-afiliados`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */

# Manifiesto de Diseño Inspirado en "Manus" - Blueprint para una UI de Élite

## 1. Filosofía de Diseño General (El "Porqué")

La interfaz de "Manus" encarna una filosofía de **"Calma Enfocada"**. Cada elemento está diseñado para reducir la carga cognitiva y guiar al usuario hacia la acción principal, que es la interacción con la IA. La estética es profesional, moderna y minimalista, transmitiendo confianza y sofisticación.

## 2. Paleta de Colores y Branding

La estrategia de color es un **monocromático oscuro con un único color de acento primario**. Esto es consistente con nuestra propia identidad de marca, validando nuestras decisiones.

- **Fondo Principal (`--background-gray-main`):** Un gris muy oscuro, casi negro (`#121213` o similar). Proporciona un excelente contraste y reduce la fatiga visual.
- **Fondo de Navegación/Secundario (`--background-nav`):** Un tono ligeramente más claro que el fondo principal, para crear una sutil separación jerárquica.
- **Color de Acento (`--Button-primary-black`):** En "Manus", el acento para los elementos activos es un negro más profundo o un blanco brillante, creando un contraste elegante. Para `metashark-afiliados`, nuestro **verde lima eléctrico (`--primary: #ADFF2F`)** cumplirá esta función de manera aún más distintiva.
- **Texto Primario (`--text-primary`):** Un blanco o gris muy claro con alta legibilidad.
- **Texto Secundario/Terciario (`--text-tertiary`):** Grises de menor contraste, utilizados para metadatos y descripciones, creando una jerarquía tipográfica clara.

**Acción para Metashark:** Nuestra `styles/theme.ts` ya define una paleta similar. Nos aseguraremos de aplicar estos principios de contraste y jerarquía de manera consistente en todos los componentes que reconstruyamos.

## 3. Tipografía

La tipografía es limpia, moderna y altamente legible, probablemente una fuente sans-serif geométrica o neogrotesca.

- **Fuente:** La traza menciona "font-georgia" y "ui-serif", pero la apariencia general es de una `sans-serif` moderna, similar a nuestra `Geist Sans`.
- **Jerarquía:** Se utiliza una combinación de pesos de fuente (`font-medium`, `font-semibold`) y tamaños (`text-sm`, `text-xs`) para guiar la atención del usuario.

**Acción para Metashark:** Mantener el uso de `Geist Sans`. Aplicar rigurosamente una escala tipográfica consistente para títulos, párrafos y metadatos en todos los componentes.

## 4. Animación y Microinteracciones (Performance de Élite)

"Manus" utiliza `framer-motion` (evidente en los nombres de clases y la fluidez) para microinteracciones que mejoran la experiencia sin ser intrusivas.

- **Animaciones de Entrada:** Los elementos aparecen con sutiles fundidos y desplazamientos (`animate-home-chat-show`, `translate-y-0`).
- **Transiciones de Estado:** Los cambios de estado (hover, active) en botones y tarjetas tienen transiciones suaves de color y opacidad (`transition-colors`, `hover:opacity-90`).
- **Lógica de Animación Identificada:**
  - **`@keyframes caretBlink`:** Animación de parpadeo para cursores de texto.
  - **`@keyframes rotateSpinner`:** Rotación para spinners de carga.
  - **`--bprogress-` variables:** Indican el uso de una librería de barra de progreso tipo `nprogress`, que muestra una barra delgada en la parte superior de la página durante la navegación.

**Acción para Metashark:**
1.  **Implementar Barra de Progreso:** Integraremos `nprogress` o una librería similar para proporcionar feedback visual inmediato durante la navegación entre páginas y la ejecución de Server Actions.
2.  **Animaciones con Framer Motion:** Envolveremos los componentes clave (como las tarjetas del dashboard o los modales) en `<motion.div>` para aplicar animaciones de entrada sutiles, mejorando la percepción de calidad.
3.  **Transiciones CSS:** Asegurarnos de que todas las clases `hover:` y `focus:` en nuestros componentes de UI vayan acompañadas de `transition-all` para una experiencia fluida.

## 5. Blueprint de Componentes Específicos

- **Tarjetas (`Card`):**
  - **Estilo:** Bordes redondeados (`rounded-[12px]`), un borde sutil (`border-[var(--border-main)]`) y un fondo ligeramente distinto al principal (`bg-[var(--background-card-gray)]`).
  - **Interacción:** Efecto `hover` que cambia el color del borde y/o aplica una sombra sutil.
- **Botones (`Button`):**
  - **Estilo:** Radios de borde consistentes (`rounded-full`, `rounded-[10px]`). Uso claro de variantes para acciones primarias, secundarias y de solo texto.
  - **Feedback:** Efecto `hover` y `active` claro.
- **Entradas de Texto (`Input`/`Textarea`):**
  - **Estilo:** Fondo que contrasta sutilmente con el contenedor (`bg-[var(--fill-input-chat)]`), bordes redondeados y un estado de `focus` claro que resalta el borde.

**Acción para Metashark:** Nuestro sistema de diseño con `Shadcn/UI` y `theme.ts` ya nos permite replicar y estandarizar estos estilos. La clave será la **consistencia** en la aplicación.

---

Este manifiesto servirá como nuestra guía visual y de UX. A partir de ahora, cada aparato de UI que reconstruyamos será medido contra estos principios, además de los funcionales.

Base de datos reconstruida. Manifiesto de diseño establecido. **Estoy lista para proceder con la reconstrucción del flujo de autenticación**, comenzando con el `src/app/[locale]/auth/layout.tsx`.

Continuar.
// .docs/MANUS_DESIGN_ANALYSIS.md