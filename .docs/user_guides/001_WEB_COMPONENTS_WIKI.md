/**
 * @file .docs/user_guides/001_WEB_COMPONENTS_WIKI_V3.md
 * @description Wiki Exhaustiva de Componentes de ConvertiKit v3.0.
 *              Esta es la SSoT que cataloga cada "pieza de LEGO" (Web Component)
 *              disponible en nuestro sistema, explicando su propósito de forma
 *              clara, completa y accesible para un público no técnico.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.0.0
 */
# Wiki de Componentes v3.0: El Catálogo Completo de "Piezas LEGO"

## 1. Introducción: ¿Qué es un "Componente"?

Imagina que estás construyendo con LEGO. Un "Componente" es una pieza pre-diseñada con un propósito claro. En lugar de construir un coche rueda por rueda, tomas la pieza "chasis", la pieza "rueda" y las ensamblas.

En `ConvertiKit`, tu página web se construye de la misma manera. Cada elemento, desde un botón hasta una sección completa de testimonios, es un componente que puedes usar y personalizar. Esta guía es el catálogo completo de todas las piezas a tu disposición.

## 2. Árbol de Componentes: Cómo se Ensambla una Página (Ejemplo)

Una página web se compone de secciones, y cada sección contiene elementos más pequeños. `ConvertiKit` gestiona esta estructura por ti.

```mermaid
graph TD
    A[Página Web] --> B[Header (Estructural)];
    A --> C[Cuerpo de la Página];
    A --> D[Footer (Estructural)];
    
    subgraph "Cuerpo de la Página"
        C --> C1[Hero (Sección)];
        C1 --> C1a[Título (Elemento)];
        C1 --> C1b[Párrafo (Elemento)];
        C1 --> C1c[Botón CTA (Elemento)];
        C --> C2[Features (Sección)];
    end
3. Catálogo Exhaustivo de Componentes
Categoría: Componentes Estructurales
Estos componentes son el esqueleto de tu página, definiendo las áreas principales.
Header (Encabezado):
Qué es: La barra de navegación superior de tu página.
Qué hace: Muestra tu logo, los enlaces de navegación principales (ej. "Inicio", "Contacto") y un botón de llamada a la acción (CTA) principal.
Cuándo usarlo: Siempre. Es el primer componente de tu página.
Footer (Pie de Página):
Qué es: La sección final de tu página.
Qué hace: Contiene información de contacto, enlaces legales (Política de Privacidad, Términos), enlaces a redes sociales y un aviso de copyright.
Cuándo usarlo: Siempre. Es el último componente de tu página.
Section (Contenedor de Sección):
Qué es: Un contenedor invisible para agrupar otros componentes.
Qué hace: Permite aplicar un color de fondo o una imagen a un grupo de elementos, y controlar el espaciado vertical.
Variaciones: Ancho Completo, Ancho Contenido.
Columns (Columnas):
Qué es: Un componente de layout para dividir una sección en columnas.
Qué hace: Permite organizar el contenido lado a lado.
Variaciones: Dos Columnas (50/50), Tres Columnas (33/33/33), Columna Lateral Izquierda (30/70).
Categoría: Componentes de Bloque de Contenido (Secciones Pre-diseñadas)
Estos son los componentes más grandes, secciones completas que puedes arrastrar a tu página.
Hero:
Qué es: La primera sección impactante que ven tus visitantes.
Qué hace: Presenta tu propuesta de valor de forma clara y directa con un título grande, un subtítulo y botones de acción.
Features (Características):
Qué es: Una sección para destacar los beneficios de tu oferta.
Qué hace: Muestra una cuadrícula de 2 a 4 "tarjetas", cada una con un icono, título y descripción.
Testimonials (Testimonios):
Qué es: Una sección para mostrar reseñas de clientes.
Qué hace: Presenta una cita, foto y nombre del cliente para generar confianza.
Social Proof (Prueba Social):
Qué es: Una tira de logos de empresas.
Qué hace: Muestra los logos de clientes o socios para aumentar la credibilidad.
Process Steps (Pasos del Proceso):
Qué es: Una sección que explica un proceso paso a paso.
Qué hace: Muestra una lista numerada con títulos y descripciones para guiar al usuario.
FAQ (Preguntas Frecuentes):
Qué es: Una lista de preguntas y respuestas en formato de acordeón.
Qué hace: Permite a los usuarios expandir solo las preguntas que les interesan, ahorrando espacio.
CTA (Llamada a la Acción):
Qué es: Una sección diseñada para incitar una acción específica.
Qué hace: Típicamente contiene un título, un subtítulo y un botón o formulario prominente.
Metrics (Métricas):
Qué es: Una sección para mostrar datos y estadísticas clave.
Qué hace: Presenta números impactantes con etiquetas (ej. "98% de satisfacción") para reforzar tu argumento.
Team (Equipo):
Qué es: Una sección para presentar a los miembros de tu equipo.
Qué hace: Muestra una cuadrícula de tarjetas con foto, nombre, cargo y enlaces a redes sociales.
Pricing Table (Tabla de Precios):
Qué es: Una comparación de diferentes planes o productos.
Qué hace: Muestra columnas con el nombre del plan, precio, características y un botón de "Comprar".

### **Categoría: Componentes de Texto**
*Estos componentes son las "piezas LEGO" para todo el contenido escrito de tu página.*

*   **Heading (Título):**
    *   **Qué es:** Un texto de gran tamaño para títulos.
    *   **Qué hace:** Estructura tu página y guía la atención. Puedes elegir su tamaño (H1 a H6) para indicar su importancia.
    *   **Variaciones:** `Tamaño` (Gigante, Grande, Mediano, Pequeño), `Color` (Primario, Secundario, Texto), `Alineación` (Izquierda, Centro, Derecha).

*   **Paragraph (Párrafo):**
    *   **Qué es:** El bloque de texto estándar.
    *   **Qué hace:** Muestra información detallada. Optimizado para una fácil lectura.
    *   **Variaciones:** `Tamaño` (Grande, Normal, Pequeño), `Color`, `Alineación`.

*   **Rich Text (Texto Enriquecido):**
    *   **Qué es:** Un editor de texto avanzado.
    *   **Qué hace:** Permite aplicar formatos como **negrita**, *cursiva*, `subrayado`, `listas con viñetas`, `listas numeradas` y `enlaces` dentro de un mismo bloque.
    *   **Cuándo usarlo:** Cuando necesitas más control sobre el formato que un simple párrafo.

*   **Checklist (Lista de Verificación):**
    *   **Qué es:** Una lista de puntos con un icono de "check" al lado.
    *   **Qué hace:** Destaca beneficios o características de forma rápida y visualmente atractiva.
    *   **Variaciones:** `Estilo del Icono` (Check, Cruz, Punto), `Color del Icono`.

*   **Blockquote (Cita Destacada):**
    *   **Qué es:** Un bloque de texto estilizado para resaltar una cita.
    *   **Qué hace:** Separa visualmente una cita del resto del texto. A menudo incluye una línea vertical decorativa.
    *   **Cuándo usarlo:** Para citar a una persona o resaltar una frase importante.

---

### **Categoría: Componentes de Medios**
*Estos componentes te permiten añadir elementos visuales a tu página.*

*   **Image (Imagen):**
    *   **Qué es:** Un contenedor para mostrar una imagen.
    *   **Qué hace:** Te permite subir tus propias imágenes o seleccionar de tu `Asset Library`. `ConvertiKit` las optimiza automáticamente.
    *   **Variaciones:** `Forma` (Rectangular, Redondeada, Círculo), `Sombra`, `Borde`.

*   **Video:**
    *   **Qué es:** Un reproductor de video.
    *   **Qué hace:** Permite incrustar videos de YouTube o Vimeo.
    *   **Variaciones:** `Autoplay (Sin sonido)`, `Loop (Repetición)`, `Ocultar Controles`.

*   **Icon (Icono):**
    *   **Qué es:** Un pequeño gráfico simbólico.
    *   **Qué hace:** Ayuda a comunicar ideas rápidamente. Tienes acceso a una librería de miles de iconos profesionales.
    *   **Variaciones:** `Tamaño`, `Color`, `Relleno/Línea`.

*   **Logo Strip (Tira de Logos):**
    *   **Qué es:** Un carrusel o cuadrícula de logos.
    *   **Qué hace:** Es la base del componente "Social Proof". Muestra los logos de las empresas con las que trabajas.
    *   **Variaciones:** `Estilo` (Color, Escala de Grises), `Animación` (Carrusel, Estático).

*   **Image Gallery (Galería de Imágenes):**
    *   **Qué es:** Una colección de imágenes mostradas juntas.
    *   **Qué hace:** Permite mostrar múltiples imágenes en un formato visualmente atractivo.
    *   **Variaciones:** `Layout` (Cuadrícula, Carrusel, Masonry), `Efecto al hacer clic` (Abrir en pantalla completa, Ir a un enlace).

*   **Separator (Separador):**
    *   **Qué es:** Una línea horizontal o vertical.
    *   **Qué hace:** Crea una separación visual clara entre diferentes secciones.
    *   **Variaciones:** `Estilo` (Sólido, Punteado, Discontinuo), `Grosor`, `Color`.

    ### **Categoría: Componentes Interactivos (Formularios y Botones)**
*Estas son las piezas que permiten a tus visitantes interactuar contigo y tomar acción.*

*   **Button (Botón):**
    *   **Qué es:** Un elemento clickeable.
    *   **Qué hace:** Dirige al usuario a otra página, abre un pop-up o envía un formulario. Es tu principal herramienta para la llamada a la acción (CTA).
    *   **Variaciones:** `Estilo` (Sólido, Contorno, Texto), `Tamaño` (Pequeño, Mediano, Grande), `Forma` (Rectangular, Redondeado), `Con Icono` (Izquierda/Derecha).

*   **Form (Formulario):**
    *   **Qué es:** Un contenedor para agrupar campos de entrada y un botón de envío.
    *   **Qué hace:** Recopila información del usuario y la envía.
    *   **Plantillas:** `Formulario de Contacto`, `Formulario de Suscripción`, `Formulario de Registro`.

*   **Input Field (Campo de Entrada):**
    *   **Qué es:** Un campo para que el usuario escriba información.
    *   **Qué hace:** Recopila datos como nombre, email, etc.
    *   **Variaciones:** `Tipo` (Texto, Email, Número, Teléfono), `Con Icono`, `Placeholder (texto de ejemplo)`.

*   **Text Area (Área de Texto):**
    *   **Qué es:** Un campo de texto más grande para mensajes largos.
    *   **Qué hace:** Permite a los usuarios escribir múltiples líneas de texto.
    *   **Cuándo usarlo:** En `Formularios de Contacto` para el campo de "Mensaje".

*   **Checkbox (Casilla de Verificación):**
    *   **Qué es:** Una caja que se puede marcar o desmarcar.
    *   **Qué hace:** Se utiliza para que los usuarios acepten términos o seleccionen opciones.
    *   **Variaciones:** `Simple`, `Con Etiqueta a la Derecha`.

*   **Select / Dropdown (Menú Desplegable):**
    *   **Qué es:** Una lista de opciones que se despliega al hacer clic.
    *   **Qué hace:** Permite al usuario seleccionar una opción de una lista predefinida.
    *   **Cuándo usarlo:** En formularios para opciones múltiples (ej. País, Tipo de consulta).

*   **Radio Button Group (Grupo de Botones de Radio):**
    *   **Qué es:** Un conjunto de opciones donde solo una puede ser seleccionada.
    *   **Qué hace:** Permite al usuario elegir una única opción de varias.
    *   **Cuándo usarlo:** Para preguntas de opción única, como seleccionar un plan.

---

### **Categoría: Componentes de Layout y Misceláneos**
*Estas piezas te ayudan a organizar y embellecer el diseño de tu página.*

*   **Card (Tarjeta):**
    *   **Qué es:** Un contenedor con un borde y sombra sutiles.
    *   **Qué hace:** Agrupa contenido relacionado (como una imagen, un título y un texto) en una unidad visual cohesiva.
    *   **Cuándo usarlo:** Es la base para componentes como `Features` y `Testimonials`.

*   **Accordion (Acordeón):**
    *   **Qué es:** Una lista de cabeceras que se pueden expandir para revelar contenido.
    *   **Qué hace:** Permite organizar grandes cantidades de información en un espacio reducido.
    *   **Cuándo usarlo:** Es la base para el componente `FAQ`.

*   **Tabs (Pestañas):**
    *   **Qué es:** Un conjunto de pestañas clickeables que muestran diferente contenido.
    *   **Qué hace:** Organiza el contenido en secciones intercambiables sin necesidad de hacer scroll.
    *   **Cuándo usarlo:** Ideal para mostrar diferentes características de un producto o planes de precios.

*   **Avatar:**
    *   **Qué es:** Un círculo para mostrar una imagen de perfil o iniciales.
    *   **Qué hace:** Representa a un usuario o autor.
    *   **Cuándo usarlo:** En la sección de `Testimonials`.

*   **Badge (Insignia):**
    *   **Qué es:** Una pequeña etiqueta de color.
    *   **Qué hace:** Destaca información breve como una categoría de blog o el estado de un producto.
    *   **Cuándo usarlo:** Para añadir contexto visual a un elemento.

*   **Tooltip (Información Emergente):**
    *   **Qué es:** Un pequeño cuadro de texto que aparece al pasar el cursor sobre un elemento.
    *   **Qué hace:** Proporciona información adicional o aclaraciones sin saturar la interfaz.
    *   **Cuándo usarlo:** En iconos, botones o términos técnicos para ofrecer más contexto.

*   **Progress Bar (Barra de Progreso):**
    *   **Qué es:** Una barra que se llena para mostrar el progreso.
    *   **Qué hace:** Indica visualmente qué tan cerca está de completarse una tarea o un objetivo.
    *   **Cuándo usarlo:** Para mostrar el progreso de un curso, el llenado de un perfil o metas de recaudación.

*   **Countdown Timer (Temporizador de Cuenta Regresiva):**
    *   **Qué es:** Un reloj que cuenta hacia atrás hasta una fecha y hora específicas.
    *   **Qué hace:** Crea un sentido de urgencia para ofertas por tiempo limitado.
    *   **Cuándo usarlo:** En `Heros` o `CTAs` para lanzamientos de productos o promociones.

    