// .docs/BRANDING_CONVENTIONS.md
/**
 * @file .docs/BRANDING_CONVENTIONS.md
 * @description Manifiesto de Branding y Guía de Implementación de Élite v3.0.
 *              Esta es la Única Fuente de Verdad (SSoT) técnica para la identidad
 *              visual de "ConvertiKit". Define una estrategia de "Acentos Duales"
 *              para maximizar la conversión y el impacto visual.
 * @author Raz Podestá
 * @version 3.0.0
 */

# Manifiesto de Branding v3.0: Estrategia de Acentos Duales

## 1. Misión
Implementar y mantener una identidad visual de élite, memorable y optimizada para la conversión. La filosofía es **"Energía Enfocada"**: una estética premium y oscura, dinamizada por puntos focales de color de alta intensidad que guían la acción del usuario.

## 2. Paleta de Colores de Élite (SSoT)

### 2.1. Colores Base (Monocromáticos)
- **Fondo Principal:** Negro Intenso (`#000000` o un gris muy oscuro como `#0A0A0A`). Proporciona el máximo contraste.
- **Fondos Secundarios/Tarjetas:** Grises oscuros sutiles para crear profundidad (ej. `#111111`, `#1A1A1A`).
- **Texto Principal:** Blanco Puro (`#FFFFFF`).
- **Texto Secundario/Muted:** Grises claros (`#A1A1A1`).

### 2.2. Acentos Duales Primarios (Alta Energía)
Estos dos colores tienen el mismo nivel jerárquico y se usan estratégicamente para diferentes propósitos psicológicos.

- **Verde de Conversión (`--color-primary`):**
  - **Valor:** `hsl(74, 100%, 50%)` o `#ADFF2F`.
  - **Propósito:** **Acción y Éxito.** Se reserva para los elementos de conversión más importantes: botones de CTA primarios ("Empezar Ahora", "Crear Cuenta"), títulos principales, indicadores de éxito y estados de foco. Su misión es decir "Haz clic aquí".

- **Naranja de Valor (`--color-secondary`):**
  - **Valor:** Naranja Fosforescente (ej. `hsl(16, 100%, 50%)` o `#FF4500`).
  - **Propósito:** **Atención y Beneficio.** Se utiliza para resaltar beneficios clave, ofertas, etiquetas de "Nuevo", o elementos que deben captar la atención sin ser el CTA principal. Su misión es decir "Mira esto, es importante".

### 2.3. Acento Terciario (Confianza)
- **Azul de Confianza:** Un azul sutil para enlaces de texto, citas en testimonios o elementos que denotan confianza y soporte.

## 3. Estrategia de Implementación

- **`HomePage`:**
  - `Hero > h1`: Verde de Conversión (`text-primary`).
  - `Hero > CTA Primario`: Verde de Conversión (`bg-primary`).
  - `Features > Iconos`: Naranja de Valor (`text-secondary`).
  - `Metrics > Números`: Verde de Conversión (`text-primary`).
  - `Testimonials > Citas`: Azul de Confianza.
- **Secciones:** Delimitar cada sección con un fondo de gris oscuro ligeramente diferente para crear ritmo visual.
- **Botones:**
  - Primario: `bg-primary` (Verde).
  - Secundario: `variant="outline"` con borde `border-secondary` (Naranja).
- **Iconografía:** Los iconos (`lucide-react`) deben heredar el color del texto (`text-primary`, `text-secondary`) para una consistencia total.

## 4. Tipografía y Espaciado
- **Fuente:** `Geist Sans`.
- **Jerarquía:** Uso estricto de pesos (`font-bold`, `font-semibold`) y tamaños para guiar al usuario.
- **Espaciado:** Generoso, para permitir que los elementos "respiren" y reducir la carga cognitiva.

