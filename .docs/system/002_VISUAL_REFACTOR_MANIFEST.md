// .docs/system/002_VISUAL_REFACTOR_MANIFEST.md
/**
 * @file .docs/system/002_VISUAL_REFACTOR_MANIFEST.md
 * @description Manifiesto Maestro de Refactorización Visual v1.0.
 *              Esta es la SSoT que define la adopción de la filosofía de diseño
 *              "Calma Enfocada" y detalla los cambios necesarios en la
 *              infraestructura de estilos para implementarla holísticamente.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Maestro de Refactorización Visual v1.0: "Calma Enfocada"

## 1. Filosofía y Objetivos

*   **Filosofía:** Adoptamos **"Calma Enfocada"**. La UI será profesional, moderna y minimalista, con una paleta de colores oscura y monocromática, acentuada por colores primarios y secundarios de alta intensidad para guiar la acción.
*   **Objetivos:**
    1.  **Refinar Tokens de Diseño:** Actualizar nuestra SSoT de estilos (`globals.css`) para reflejar la nueva paleta de colores.
    2.  **Propagación Automática:** Asegurar que los cambios en los tokens se propaguen a todos los componentes de UI sin refactorización individual.
    3.  **Mejorar Microinteracciones:** Implementar animaciones sutiles y feedback visual para una UX de élite.

## 2. Plan de Acción y Repercusiones en Archivos

### 2.1. Fase 1: Refinamiento de la SSoT de Estilos

*   **Aparato a Modificar:** `src/app/globals.css`
*   **Acciones:**
    1.  **Actualizar Paleta de Colores (Tema Oscuro):** Modificar las variables CSS en la sección `:root` para alinearse con la paleta de "Calma Enfocada".
        *   `--background`: Un gris muy oscuro (ej. `222 47% 11%`).
        *   `--card`: Un tono ligeramente más claro que el fondo (ej. `222 47% 15%`).
        *   `--primary`: Mantener nuestro verde lima eléctrico (`74 92% 56%`).
        *   `--secondary`: Introducir un naranja de alto impacto para acentos secundarios (ej. `16 100% 50%`).
    2.  **Actualizar Radios de Borde:** Refinar `--radius` para bordes más sutiles y consistentes (ej. `0.75rem` para `lg`).

### 2.2. Fase 2: Verificación de Propagación

*   **Aparatos Afectados (Indirectamente):**
    *   `tailwind.config.mjs`: Consumirá automáticamente las nuevas variables CSS. No requiere cambios.
    *   Todos los componentes de `src/components/ui/` (`Button`, `Card`, etc.): Heredarán los nuevos estilos a través de las clases de Tailwind (`bg-primary`, `rounded-lg`). No requieren cambios.
*   **Verificación:** La modificación de `globals.css` debe resultar en un cambio visual global en toda la aplicación.

### 2.3. Fase 3: Mejora de Microinteracciones (Roadmap Futuro)

*   **Aparato a Implementar:** Un hook `useNProgress` o una integración similar.
*   **Acción:** Implementar una barra de progreso de carga a nivel de `layout` que se active en la navegación y durante la ejecución de Server Actions para un feedback instantáneo.
*   **Aparato a Modificar (Ejemplo):** Envolver componentes clave como `ActionCard` en `motion.div` de `framer-motion` para añadir animaciones de entrada sutiles.

// .docs/system/002_VISUAL_REFACTOR_MANIFEST.md