// .docs/005_PROJECT_ARCHITECTURE_MANIFEST.md
/**
 * @file .docs/005_PROJECT_ARCHITECTURE_MANIFEST.md
 * @description Manifiesto Canónico de Arquitectura General del Proyecto v1.0.
 *              Esta es la Única Fuente de Verdad (SSoT) que define la estructura
 *              de directorios de `ConvertiKit` y la responsabilidad de cada
 *              componente arquitectónico. Sirve como el mapa maestro para la navegación
 *              y el desarrollo dentro de la base de código.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 1.0.0
 */
# Manifiesto Canónico de Arquitectura General del Proyecto v1.0

## 1. Filosofía: "Cohesión de Dominio y Desacoplamiento de Capas"

La estructura de ficheros de `ConvertiKit` está diseñada para ser intuitiva y escalable. Se basa en dos principios fundamentales:
1.  **Agrupación por Dominio:** Los artefactos relacionados con una misma entidad de negocio (ej. `sites`) se agrupan, incluso a través de diferentes capas.
2.  **Separación por Capa:** Se mantiene una clara separación entre las responsabilidades de la aplicación (presentación, lógica, datos, etc.).

## 2. Diagrama de Directorios de Alto Nivel
/
├── .docs/ # SSoT Documental: Manifiestos, Roadmaps, Decisiones
├── public/ # Activos Estáticos (imágenes, fuentes)
├── src/
│ ├── app/ # Capa de Enrutamiento y Vistas (Next.js App Router)
│ ├── components/ # Capa de Presentación (Componentes de UI Reutilizables)
│ ├── lib/ # Capa de Lógica y Abstracción (El "Cerebro")
│ ├── messages/ # Capa de Contenido (Internacionalización)
│ ├── middleware/ # Lógica de Edge (Seguridad, i18n, etc.)
│ └── templates/ # Componentes de Bloque para el Builder
├── tests/ # Infraestructura de Pruebas (Unit, Integration, E2E)
└── [Archivos de Configuración Raíz]

## 3. Desglose Detallado de Directorios `src/`

### 3.1. `src/app/` - La Capa de Enrutamiento

*   **Propósito:** Define las rutas de la aplicación. Es el punto de entrada para las peticiones de los usuarios.
*   **Contenido:**
    *   `[locale]/`: Gestiona la internacionalización de las rutas.
    *   `layout.tsx`: Layouts raíz y anidados que definen la estructura visual de las páginas.
    *   `page.tsx`: **Orquestadores de Datos (Server Components).** Su única responsabilidad es obtener los datos necesarios para una página desde la capa de lógica (`/lib/`) y pasarlos a los componentes de cliente.
    *   `*-client.tsx`: **Ensambladores de UI (Client Components).** Su única responsabilidad es recibir datos como `props`, consumir hooks de estado y ensamblar la UI interactiva de una página.
    *   `api/`: Route Handlers para endpoints de API.

### 3.2. `src/components/` - La Capa de Presentación ("LEGO Bricks")

*   **Propósito:** Contiene todos los componentes de UI reutilizables. Deben ser lo más puros posible.
*   **Contenido:**
    *   `ui/`: **Átomos de UI.** Primitivas de diseño fundamentales y agnósticas al negocio (`Button`, `Card`, `Input`).
    *   `shared/`: Componentes de UI reutilizables en múltiples dominios (ej. `PaginatedDataTable`).
    *   `[dominio]/` (ej. `sites/`, `workspaces/`): Componentes específicos de un dominio de negocio (ej. `SiteCard`, `WorkspaceSwitcher`).

### 3.3. `src/lib/` - El Cerebro de la Aplicación

*   **Propósito:** Alberga toda la lógica de negocio, de estado y de acceso a datos, desacoplada de la UI.
*   **Contenido:**
    *   `actions/`: **Capa de Lógica de Negocio (Server Actions).** Única capa que orquesta las mutaciones de datos.
    *   `data/`: **Capa de Acceso a Datos.** Única capa que puede comunicarse con la base de datos para operaciones de lectura.
    *   `hooks/`: **Capa de Lógica de UI (Client Hooks).** Hooks soberanos que encapsulan el estado y la lógica de interacción para los componentes de cliente.
    *   `context/`: Proveedores de Contexto de React.
    *   `validators/`: **SSoT de Contratos de Datos (Zod Schemas).** Define la forma de todos los datos de la aplicación.
    *   `services/`: Lógica para interactuar con APIs de terceros (ej. `geoip.service.ts`).
    *   `helpers/`: Funciones puras de utilidad, reutilizables en cualquier entorno.

### 3.4. `src/messages/` - La Capa de Contenido

*   **Propósito:** SSoT para todo el contenido textual de la aplicación (i18n).
*   **Contenido:**
    *   Archivos `.json` atómicos, agrupados por dominio.
    *   `manifest.ts`: Manifiesto generado automáticamente que registra todos los archivos de mensajes.

### 3.5. `src/middleware/` - La Capa de Edge

*   **Propósito:** Lógica que se ejecuta en el Edge antes de cada petición.
*   **Contenido:**
    *   `handlers/`: Manejadores atómicos para cada responsabilidad (i18n, auth, telemetría).
    *   `middleware.ts`: El orquestador que define el pipeline de ejecución de los manejadores.

### 3.6. `src/templates/` - El Arsenal del Builder

*   **Propósito:** Contiene los componentes de bloque de plantilla (ej. `Header1`, `Hero1`) que pueden ser arrastrados y soltados en el `Canvas` del Builder.

// .docs/005_PROJECT_ARCHITECTURE_MANIFEST.md