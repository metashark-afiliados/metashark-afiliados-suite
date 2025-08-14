// .docs/BRANDING_CONVENTIONS.md
/**
 * @file .docs/BRANDING_CONVENTIONS.md
 * @description Manifiesto de Branding y Guía de Implementación de Élite.
 *              Esta es la Única Fuente de Verdad (SSoT) técnica para la identidad
 *              visual de "ConvertiKit". Define la estrategia visual y cómo se
 *              implementa a través de nuestro sistema de tokens de diseño.
 * @author Raz Podestá
 * @version 1.0.0
 */
# Manifiesto de Branding de ConvertiKit: Filosofía y SSoT Técnica

## 1. Filosofía de Diseño: "Calma Enfocada"

Nuestra identidad visual se basa en la filosofía de **"Calma Enfocada"**: una estética premium y oscura, dinamizada por puntos focales de color de alta intensidad que guían la acción del usuario sin generar ruido visual. El objetivo es proyectar sofisticación, confianza y control.

## 2. Única Fuente de Verdad (SSoT) del Sistema de Diseño

La implementación de nuestra marca es programática y centralizada, garantizando una consistencia absoluta.

- **SSoT de Definición:** `src/app/globals.css`. Este archivo define todos nuestros tokens de diseño (colores, radios) como variables CSS nativas bajo la directiva `@theme`.
- **SSoT de Consumo:** `tailwind.config.mjs`. Este archivo consume las variables CSS de `globals.css` para generar las clases de utilidad (ej. `bg-primary`, `text-foreground`).
- **SSoT de Tipografía:** La fuente `Geist Sans` es cargada en el `RootLayout` y aplicada globalmente.

## 3. Paleta de Colores de Élite (Tokens Canónicos)

Nuestra paleta se define en formato `HSL` en `globals.css` para una máxima flexibilidad.

### **Tema Oscuro (Por Defecto)**

| Token de Diseño         | Variable CSS (`--color-*`) | Valor HSL         | Propósito Psicológico                                     |
| ----------------------- | -------------------------- | ----------------- | --------------------------------------------------------- |
| **Primario (Acción)**   | `primary`                  | `74 92% 56%`      | **Conversión y Éxito.** Verde lima eléctrico para CTAs.   |
| **Secundario (Valor)**  | `secondary`                | `16 100% 50%`     | **Atención y Beneficio.** Naranja para resaltar features. |
| **Fondo**               | `background`               | `222 47% 11%`     | Sofisticación, enfoque.                                   |
| **Primer Plano**        | `foreground`               | `210 40% 98%`     | Máxima legibilidad.                                       |
| **Tarjetas / Superficie**| `card`                     | `222 47% 15%`     | Profundidad sutil.                                        |
| **Destructivo (Error)** | `destructive`              | `0 63% 31%`       | Acciones peligrosas, alertas.                             |

### **Tema Claro**

La paleta para el tema claro (`.light`) se define como una anulación de las variables CSS base dentro de `globals.css`, manteniendo la misma lógica de tokens.

## 4. Tipografía y Espaciado

- **Fuente:** `Geist Sans`.
- **Jerarquía:** Uso riguroso de pesos (`font-bold`, `font-semibold`) y tamaños para guiar al usuario.
- **Espaciado:** Generoso, para permitir que los elementos "respiren" y reducir la carga cognitiva.

## 5. Guía de Implementación

- **HomePage:**
    - `Hero > h1`: `text-primary`.
    - `Hero > CTA Primario`: `bg-primary`.
    - `Features > Iconos`: `text-secondary`.
    - `Metrics > Números`: `text-primary`.
- **Botones:**
    - **Primario:** `bg-primary` (Verde).
    - **Secundario:** `bg-secondary` (Naranja).
    - **Contorno:** `variant="outline"` con `border-border`.
- **Iconografía:** Los iconos de `lucide-react` deben heredar el color del texto (`text-primary`, `text-secondary`) para una consistencia total.

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Sincronización Arquitectónica**: ((Implementada)) El manifiesto ahora refleja con precisión la arquitectura de diseño real (variables CSS en `globals.css` consumidas por Tailwind), sirviendo como una guía de implementación precisa.
 * 2. **Rebranding Completo**: ((Implementada)) Todas las referencias han sido actualizadas a "ConvertiKit".
 * 3. **Claridad y Propósito**: ((Implementada)) El documento ahora explica claramente la filosofía de diseño y la SSoT técnica, haciéndolo mucho más valioso.
 *
 * =====================================================================
 */
// .docs/BRANDING_CONVENTIONS.md