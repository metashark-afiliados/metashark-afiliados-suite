BLUEPRINT DE ÉLITE: MÓDULO DE GESTIÓN DE CAMPAÑAS

1.  Filosofía de Diseño y Propósito (El "Porqué")
    El módulo de "Gestión de Campañas" es el núcleo operativo para el usuario final después de crear un sitio. Su misión es proporcionar una interfaz clara, rápida y eficiente para que el usuario pueda ver, crear, editar y eliminar campañas asociadas a un sitio específico. La experiencia debe ser intuitiva y sin fricciones, permitiendo al usuario pasar de la gestión a la edición (/builder) de forma inmediata.
2.  Arquitectura de Aparatos (El "Cómo Funciona")
    El módulo está diseñado siguiendo la Filosofía LEGO y el patrón Servidor-Cliente de élite para un rendimiento máximo.
    Diagrama de Flujo de Datos y Componentes:
    code
    Mermaid
    graph TD
    subgraph "Navegador del Usuario"
    A[URL: /dashboard/sites/site-123/campaigns] --> B{Página de Campañas};
    end

        subgraph "Capa de Servidor (page.tsx)"
            B --> C[Suspense Fallback: loading.tsx];
            B --> D[SitesPageLoader (Server Component)];
            D -- Permisos --> E[requireSitePermission];
            D -- Datos --> F[data.campaigns.getCampaignsMetadataBySiteId];
            F -- Props --> G[CampaignsClient (Client Component)];
        end

        subgraph "Capa de Cliente (campaigns-client.tsx)"
            G -- Lógica --> H[useOptimisticResourceManagement];
            G -- Ensambla --> I[CampaignsPageHeader];
            G -- Ensambla --> J[SearchToolbar];
            G -- Ensambla --> K[DataTable];
            G -- Ensambla --> L[PaginationControls];
            I -- Contiene --> M[CreateCampaignForm];
            K -- Consume --> N[CampaignsTableColumns];
        end

    Desglose de Aparatos y Responsabilidades:
    page.tsx (Contenedor de Servidor Puro):
    Función: Punto de entrada. Su única responsabilidad es renderizar el Suspense boundary.
    Lógica: Muestra loading.tsx de inmediato mientras el SitesPageLoader se ejecuta en el servidor.
    sites-page-loader.tsx (Cargador de Datos de Servidor):
    Función: El "cerebro" del lado del servidor.
    Lógica:
    Seguridad: Invoca al guardián requireSitePermission para validar que el usuario tiene acceso al sitio (siteId) de la URL. Si no, redirige.
    Obtención de Datos: Invoca a data.campaigns.getCampaignsMetadataBySiteId con los parámetros de paginación y búsqueda (page, q) de la URL para obtener la lista inicial de campañas.
    Ensamblaje: Renderiza el CampaignsClient, pasándole los datos iniciales como props.
    campaigns-client.tsx (Orquestador de Cliente):
    Función: El "cerebro" del lado del cliente. Gestiona toda la interactividad.
    Lógica:
    Gestión de Estado: Utiliza el hook useOptimisticResourceManagement para manejar las actualizaciones de UI instantáneas (crear/eliminar campañas) con lógica de rollback.
    Manejo de Interacciones: Contiene los handleCreate, handleDelete, y handleSearch que invocan las Server Actions y actualizan la URL.
    Ensamblaje de UI: Obtiene las traducciones y las pasa, junto con el estado y los manejadores, a los componentes de presentación puros (CampaignsPageHeader, DataTable, etc.).
    Componentes de Presentación Atómicos (/components/campaigns/, /components/shared/):
    Función: Piezas de "Lego" puras y reutilizables.
    CampaignsPageHeader: Muestra el título y el botón "Nueva Campaña", que abre un diálogo con el CreateCampaignForm.
    CreateCampaignForm: Formulario validado con Zod para crear una nueva campaña.
    DataTable: Componente genérico que renderiza cualquier estructura de tabla.
    CampaignsTableColumns: Aparato Clave. Es una función pura que define la estructura de la tabla de campañas (qué columnas mostrar y cómo renderizar cada celda). Es consumido por DataTable.

3.  Plan de Perfeccionamiento (UI/UX, Rendimiento y DX)
    Aquí es donde elevamos el módulo a un estándar de élite superior al del snapshot primitivo.
    A. Mejoras de Rendimiento:
    Virtualización de Filas (TanStack Virtual):
    Problema: Si un sitio tiene miles de campañas, renderizar todas las filas en el DOM, incluso con paginación, puede ralentizar el navegador.
    Solución de Élite: Integrar @tanstack/react-virtual en el componente DataTable. Esto renderizará solo las filas visibles en el viewport del usuario, manteniendo un rendimiento instantáneo sin importar si hay 100 o 100,000 campañas. El rendimiento percibido será constante.
    Cacheo de Permisos en Servidor (React.cache):
    Problema: requireSitePermission consulta la base de datos. Si otros componentes en la misma página también necesitan verificar permisos, se podrían generar consultas redundantes.
    Solución de Élite: Envolver la lógica interna de los guardianes de permisos en unstable_cache. Esto ya está implementado en la reconstrucción, garantizando un rendimiento óptimo en el servidor.
    B. Mejoras de UI/UX:
    Edición en Línea (Inline Editing):
    Problema: Para cambiar el nombre de una campaña, el usuario debe navegar al constructor (/builder), lo que es una fricción innecesaria.
    Solución de Élite: Hacer que el campo "Nombre" en la DataTable sea editable en línea. Al hacer clic, se convierte en un <Input>. Al presionar Enter o perder el foco, se invoca una nueva Server Action updateCampaignNameAction, que actualiza el nombre de forma optimista.
    Acciones Rápidas y Menú Contextual:
    Problema: El botón "Editar" es la única acción principal. Otras acciones (duplicar, archivar, ver estadísticas) podrían saturar la fila.
    Solución de Élite: Mantener "Editar" como el botón principal y agrupar las acciones secundarias (Duplicar, Archivar, Eliminar) dentro de un DropdownMenu (icono de tres puntos), como en la SiteCard. Esto limpia la interfaz y la hace más escalable.
    Vista de Cuadrícula vs. Lista:
    Problema: Una tabla es eficiente, pero una vista de cuadrícula con previsualizaciones de la landing page puede ser más visual y útil.
    Solución de Élite: Añadir un conmutador de vista (iconos de lista/cuadrícula) en el CampaignsPageHeader. El CampaignsClient renderizaría condicionalmente el DataTable o un nuevo componente CampaignsGrid (similar al SitesGrid).
    C. Mejoras de Developer Experience (DX):
    Factorías de Pruebas (tests/utils/factories.ts):
    Problema: Escribir pruebas para este flujo requiere crear datos de campaña y sitio simulados repetidamente.
    Solución de Élite: Crear funciones factoría como createMockCampaign() y createMockSite() que generen objetos de prueba consistentes. Esto hace que las pruebas sean más limpias, rápidas de escribir y fáciles de mantener.
    Tipado Fuerte de ColumnDef:
    Problema: El tipo de @tanstack/react-table es genérico.
    Solución de Élite: La función getCampaignsColumns debe ser fuertemente tipada para aceptar ColumnDef<CampaignMetadata>, garantizando que solo se puedan acceder a propiedades válidas del objeto de campaña al definir las celdas.

---
/**
 * @file .docs/espejo/app/[locale]/dashboard/sites/[siteId]/campaigns/manifest.md
 * @description Manifiesto de Arquitectura de Élite v1.0 para el Módulo de Gestión de Campañas.
 *              Este documento es la Única Fuente de Verdad (SSoT) para la filosofía,
 *              arquitectura y plan de perfeccionamiento del flujo de usuario
 *              `.../sites/[siteId]/campaigns`.
 * @author Raz Podestá
 * @version 1.0.0
 */

# Manifiesto de Élite: Módulo de Gestión de Campañas

## 1. Filosofía de Diseño y Propósito

La misión de este módulo es ser el **Centro de Comando Operativo** para las campañas de un sitio. La experiencia del usuario (UX) debe ser sin fricciones, proporcionando una visión clara del estado de todas las campañas y permitiendo acciones rápidas (crear, editar, analizar) con una carga cognitiva mínima. El diseño debe inspirar control, eficiencia y confianza.

## 2. Arquitectura de Aparatos (Patrón Servidor-Cliente de Élite)

El módulo se construye sobre una arquitectura desacoplada que separa la obtención de datos y seguridad (servidor) de la interactividad (cliente) para un rendimiento y escalabilidad máximos.

**Diagrama de Flujo Lógico:**
```mermaid
graph TD
    subgraph "Server-Side"
        A[URL Request] --> B(page.tsx);
        B -- Renders --> C(Suspense Fallback);
        B -- Triggers --> D(sites-page-loader.tsx);
        D -- 1. Auth & Permissions --> E[requireSitePermission];
        D -- 2. Data Fetching --> F[data.campaigns.getCampaignsMetadataBySiteId];
        D -- 3. Renders & Passes Props --> G[campaigns-client.tsx];
    end

    subgraph "Client-Side"
        G -- Manages State & Logic --> H[useOptimisticResourceManagement];
        G -- Assembles UI --> I(CampaignsPageHeader);
        G -- Assembles UI --> J(DataTable);
        I -- Opens Dialog --> K(CreateCampaignHub);
        J -- Consumes Definition --> L(CampaignsTableColumns);
    end
page.tsx y loader.tsx: Orquestadores de servidor puros. Su única función es manejar la seguridad, obtener los datos iniciales y pasar las props al cliente, mientras un loading.tsx provee feedback visual inmediato.
campaigns-client.tsx: Orquestador de cliente. No contiene JSX de presentación. Su única función es gestionar el estado (vía useOptimisticResourceManagement), manejar las interacciones del usuario e inyectar datos, callbacks y traducciones a los componentes de presentación hijos.
Componentes Atómicos (/components/campaigns, /components/shared): Piezas de UI puras (la "Filosofía LEGO"). CampaignsPageHeader, DataTable, etc., son agnósticos al estado y al contenido, recibiendo todo a través de props.
3. Plan de Perfeccionamiento de Élite (UI/UX, Performance, DX)
3.1. UI/UX (Experiencia de Usuario)
Hub de Creación de Campañas (Mejora Crítica):
Requisito: El diálogo "Crear Campaña" no será un simple formulario, sino un Tab component con tres opciones:
"Desde Cero": Formulario simple para el nombre.
"Desde Plantilla": Galería visual de SiteTemplates filtrable.
"Clonar con IA": Placeholder para subir una imagen (deshabilitado inicialmente).
Impacto: Acelera drásticamente el flujo de trabajo y posiciona el producto como una herramienta de élite.
Centro de Comando en la Tabla (DataTable):
Requisito: La tabla de campañas debe incluir:
Columna "Estado": Un "badge" de color (draft, published).
Acciones Rápidas: Botón "Editar" prominente y un DropdownMenu ("...") para acciones secundarias (Duplicar, Archivar, Eliminar).
Previsualización en Hover: Un <Popover> que muestre una miniatura de la campaña al pasar el cursor sobre la fila.
3.2. Rendimiento
Virtualización de Filas (@tanstack/react-virtual):
Requisito: El componente DataTable debe implementar virtualización para manejar de forma eficiente sitios con miles de campañas.
Impacto: Garantiza un rendimiento de renderizado constante y una UX fluida a cualquier escala.
3.3. Observabilidad y Resiliencia
Contrato de Errores I18n:
Requisito: Todas las Server Actions (create, update, delete) deben devolver claves de internacionalización para los mensajes de error, no strings codificados.
Impacto: Desacopla la lógica de servidor de la capa de presentación y permite una UI totalmente localizada.
Registro Persistente de Errores:
Requisito: Cualquier error inesperado en las Server Actions debe ser capturado, enviado a Sentry y registrado en la tabla system_errors a través del helper createPersistentErrorLog.
Impacto: Crea un sistema de monitoreo de errores a prueba de fallos y de nivel empresarial.
3.4. Developer Experience (DX)
Factorías de Pruebas:
Requisito: Crear createMockCampaign() en tests/utils/factories.ts para simplificar la escritura de pruebas unitarias y de integración para este flujo.
4. Estructura de Aparatos a Reconstruir
src/components/shared/data-table.tsx (Componente Genérico)
src/components/campaigns/CampaignsTableColumns.tsx (Definición de Columnas Nivelada)
src/components/campaigns/CreateCampaignForm.tsx (Promovido a "Hub de Creación")
src/components/campaigns/CampaignsPageHeader.tsx (Ensamblador del Hub)
src/app/[locale]/dashboard/sites/[siteId]/campaigns/campaigns-client.tsx (Orquestador de Cliente)
src/app/[locale]/dashboard/sites/[siteId]/campaigns/loading.tsx (Esqueleto de Carga)
src/app/[locale]/dashboard/sites/[siteId]/campaigns/page.tsx (Contenedor de Servidor)
src/lib/actions/campaigns.actions.ts (Nivelado para soportar creación desde plantilla)
---

SUJERO A REFACTORIZACIONES Y MEJORIAS CONTINUAS, SI DETECTAS ALGUNA HAZLA SABER DE E]INMEDIATO
