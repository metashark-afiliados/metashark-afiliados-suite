// .docs/builder/header-design-proposal.md
/**
 * @file .docs/builder/header-design-proposal.md
 * @description Propuesta de Diseño y Arquitectura para la Cabecera del Constructor.
 *              Este documento detalla la descomposición arquitectónica y la
 *              distribución de información para el `BuilderHeader`.
 * @author Raz Podestá
 * @version 1.0.0
 */
# Propuesta de Arquitectura para el Header del Constructor (`BuilderHeader`)

## 1. Filosofía de Diseño

La cabecera del constructor no es meramente decorativa; es un **Centro de Información y Acciones Contextuales**. Su misión es proporcionar al usuario una conciencia situacional completa y un acceso rápido a las acciones más críticas sin abandonar el flujo de trabajo principal.

## 2. Descomposición Arquitectónica del Header

El header se divide en tres zonas lógicas, cada una con una responsabilidad específica, alineadas con la implementación final.

### **Zona Izquierda: Navegación y Contexto**

*   **Componente:** `Button` con `Link` de `next-intl`.
*   **Contenido:**
    1.  **Botón "Volver al Dashboard":** Proporciona una salida clara del editor hacia el panel principal.
*   **Propósito:** Orientar al usuario, ofreciendo un punto de anclaje y navegación consistente.

### **Zona Central: Controles de Edición y Previsualización**

*   **Componentes Atómicos:** `HistoryControls` y `DevicePreviewControls`.
*   **Contenido:**
    1.  **Controles de Historial (`HistoryControls`):** Botones para Deshacer y Rehacer acciones, con tooltips informativos.
    2.  **Controles de Vista de Dispositivo (`DevicePreviewControls`):** Iconos para cambiar la previsualización del `Canvas` entre Desktop, Tablet y Móvil.
*   **Propósito:** Proporcionar al usuario control directo sobre el historial de su trabajo y la apariencia responsiva de su diseño.

### **Zona Derecha: Acciones Globales y Estado**

*   **Componentes:** `Button` de Previsualización y `SaveStatusButton`.
*   **Contenido:**
    1.  **Botón de Previsualización:** Abre la URL pública de la campaña en una nueva pestaña.
    2.  **Botón de Estado de Guardado (`SaveStatusButton`):** El Call-to-Action principal para la persistencia. Es un componente dinámico que refleja el estado actual del trabajo:
        *   **Estado Sucio (Dirty):** `Guardar Cambios` (activo).
        *   **Estado de Carga (Loading):** `Guardando...` (deshabilitado con spinner).
        *   **Estado Limpio (Pristine):** `Guardado` (deshabilitado con icono de check).
*   **Propósito:** Servir como el panel de control para las acciones que afectan a la campaña en su totalidad y comunicar el estado de persistencia de los datos.

## 3. Diagrama de Flujo Lógico (Implementado)

```mermaid
graph TD
    subgraph "Zona Izquierda (Navegación)"
        A["<Link> Volver al Dashboard"]
    end

    subgraph "Zona Central (Controles)"
        B["<HistoryControls />"] --> C["<DevicePreviewControls />"]
    end

    subgraph "Zona Derecha (Acciones y Estado)"
        D["<Button> Previsualizar"] --> E["<SaveStatusButton />"]
    end