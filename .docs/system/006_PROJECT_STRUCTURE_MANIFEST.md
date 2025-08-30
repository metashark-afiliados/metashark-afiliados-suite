// .docs/system/006_PROJECT_STRUCTURE_MANIFEST.md
/**
 * @file .docs/system/006_PROJECT_STRUCTURE_MANIFEST.md
 * @description Manifiesto de Estructura del Proyecto v1.0.
 *              Esta es la SSoT que define la estructura de directorios de ConvertiKit
 *              y la responsabilidad de cada componente arquitectónico. Sirve como el
 *              mapa maestro para la navegación y el desarrollo. Reemplaza a
 *              `.docs/005_PROJECT_ARCHITECTURE_MANIFEST.md`.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto de Estructura del Proyecto v1.0

## 1. Filosofía: "Cohesión de Dominio y Desacoplamiento de Capas"
La estructura de ficheros está diseñada para ser intuitiva y escalable. Se basa en:
1.  **Agrupación por Dominio:** Artefactos relacionados con una misma entidad de negocio (ej. `sites`) se agrupan.
2.  **Separación por Capa:** Clara separación entre las responsabilidades (presentación, lógica, datos).

## 2. Diagrama de Directorios de Alto Nivel
/
├── .docs/ # SSoT Documental: Manifiestos, Roadmaps, Decisiones
├── public/ # Activos Estáticos (imágenes, fuentes)
├── src/
│ ├── app/ # Capa de Enrutamiento y Vistas (Next.js App Router)
│ ├── components/ # Capa de Presentación (Componentes de UI Reutilizables)
│ ├── lib/ # Capa de Lógica y Abstracción (El "Cerebro")
│ ├── messages/ # Capa de Contenido (Internacionalización)
│ └── middleware/ # Lógica de Edge (Seguridad, i18n, etc.)
└── tests/ # Infraestructura de Pruebas (Unit, Integration, E2E)
code
Code
## 3. Desglose Detallado de Directorios `src/`

### 3.1. `src/app/` - La Capa de Enrutamiento
*   **Propósito:** Define las rutas de la aplicación. Punto de entrada para las peticiones.
*   **Contenido:**
    *   `layout.tsx`: Layouts raíz y anidados.
    *   `page.tsx`: **Orquestadores de Datos (Server Components).** Obtienen datos y los pasan a los componentes de cliente.
    *   `*-client.tsx`: **Ensambladores de UI (Client Components).** Reciben datos, consumen hooks y ensamblan la UI.
    *   `api/`: Route Handlers para endpoints de API.

### 3.2. `src/components/` - La Capa de Presentación ("LEGO Bricks")
*   **Propósito:** Contiene todos los componentes de UI reutilizables.
*   **Contenido:**
    *   `ui/`: **Átomos de UI.** Primitivas agnósticas al negocio (`Button`, `Card`).
    *   `shared/`: Componentes reutilizables en múltiples dominios (`PaginatedDataTable`).
    *   `[dominio]/` (ej. `sites/`): Componentes específicos de un dominio (`SiteCard`).

### 3.3. `src/lib/` - El Cerebro de la Aplicación
*   **Propósito:** Alberga toda la lógica de negocio, de estado y de acceso a datos, desacoplada de la UI.
*   **Contenido:**
    *   `actions/`: **Capa de Lógica de Negocio (Server Actions).** Única capa que orquesta mutaciones.
    *   `data/`: **Capa de Acceso a Datos.** Única capa que se comunica con la DB para lecturas.
    *   `hooks/`: **Capa de Lógica de UI (Client Hooks).** Encapsulan el estado y la lógica de interacción.
    *   `validators/`: **SSoT de Contratos de Datos (Zod Schemas).**
    *   `services/`: Lógica para interactuar con APIs de terceros.

### 3.4. `src/messages/` - La Capa de Contenido (i18n)
*   **Propósito:** SSoT para todo el contenido textual de la aplicación.
*   **Contenido:** Archivos `.json` atómicos, agrupados por dominio.

### 3.5. `src/middleware/` - La Capa de Edge
*   **Propósito:** Lógica que se ejecuta en el Edge antes de cada petición.
*   **Contenido:**
    *   `handlers/`: Manejadores atómicos para cada responsabilidad (i18n, auth, telemetría).
    *   `middleware.ts`: Orquestador que define el pipeline de ejecución de los manejadores.
// .docs/system/006_PROJECT_STRUCTURE_MANIFEST.md