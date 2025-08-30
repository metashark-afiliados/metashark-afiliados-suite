¡Entendido! La directiva es precisa. Nivelación holística, respetando las librerías existentes, pero identificando e instalando nuevas librerías necesarias. Mi prioridad es la visión holística para actualizar scripts y ordenar dependencias, con un enfoque inquebrantable en la personalización de la UI y la capacidad de intercambio de componentes, así como la adherencia a DRY, SOLID, internacionalización completa, observabilidad y madurez arquitectónica.
Antes de proceder con la refactorización de db/04_tables/04_invitations.sql, me solicitas documentar conceptualmente la mejora relacionada con la intercambiabilidad de librerías de iconos y estilos en la carpeta .docs, priorizando una implementación "free price" (eficiente, sin costos adicionales, utilizando lo ya disponible o librerías Open Source gratuitas) y de alta performance.
DOCUMENTACIÓN CONCEPTUAL: ESTRATEGIA DE PERSONALIZACIÓN DE UI Y GESTIÓN DE LIBRERÍAS (ÉLITE Y "FREE PRICE")
Ruta del Documento: .docs/UI_CUSTOMIZATION_STRATEGY.md
Autor: Raz Podestá - MetaShark Tech, Florianópolis/SC, Brazil, raz.metashark.tech
Versión: 1.0.0
Fecha: 2025-08-28
Estrategia de Personalización de UI y Gestión de Librerías (Élite y "Free Price")

1. Visión General: Un Builder Verdaderamente Flexible
   La visión es empoderar a los usuarios (y a los desarrolladores) para que tengan un control granular sobre la apariencia y las funcionalidades del sitio web, sin depender de librerías o frameworks rígidos. Esto implica que elementos clave como la librería de iconos, la tipografía global y la paleta de colores no sean "quemados" en el código, sino configurables y, preferiblemente, intercambiables. La meta es una UI que se sienta "nativa" para cada marca, manteniendo una alta performance y un costo operativo "free price" (optimizando recursos existentes o usando soluciones Open Source gratuitas).
2. Pilares de la Arquitectura de Personalización
   La solución se basará en una combinación estratégica de principios ya establecidos y extensiones lógicas:
   Filosofía "Configuración sobre Código": La lógica para la personalización residirá en manifiestos y configuraciones, no en código imperativo.
   Modularidad y Atomicidad (Filosofía LEGO): Cada aspecto de la personalización será un "aparato" desacoplado.
   SSoT (Única Fuente de Verdad): La definición de temas y librerías de iconos tendrá un origen centralizado.
   Backend-Driven UI (para configuraciones persistentes): Las preferencias del usuario se almacenarán en la base de datos.
3. Implementación Holística de la Personalización (Enfoque "Free Price" y Alta Performance)
   3.1. Personalización de Fuentes y Estilos Globales
   Concepto: El usuario podrá definir una paleta de colores global y una fuente principal para su sitio/campaña.
   Aparatos Clave y Refactorizaciones:
   src/config/tailwind-theme.config.ts (Nuevo Manifiesto):
   Propósito: Servirá como la SSoT para la definición de la estructura de un tema (colores, fuentes, radios). No definirá los valores, sino la forma en que se pueden personalizar.
   Contenido: Un objeto que definirá las "ranuras" de personalización: primaryColor: { default: '...', key: 'brand.colors.primary' }, globalFont: { default: '...', key: 'brand.fonts.globalFont' }.
   Responsabilidad: Declarar el contrato de lo que un "tema" puede personalizar.
   globals.css (Existente - SSoT de Tokens CSS):
   Propósito: Continuará siendo la SSoT para las variables CSS (--primary, --background, --font-geist-sans).
   Refactorización: Se adaptará para incluir variables CSS dinámicas que puedan ser sobreescritas por el usuario. Por ejemplo, se introduciría un nuevo conjunto de variables: --user-primary: var(--primary); --user-font-family: var(--font-geist-sans);. Los componentes consumirían hsl(var(--user-primary)) o var(--user-font-family).
   tailwind.config.mjs (Existente - Consumidor de Tokens):
   Propósito: Consumir estas variables CSS.
   Refactorización: Ya lo hace. Asegurar que las clases generadas (ej. bg-primary, font-sans) apunten a las variables dinámicas var(--user-...) si se decide la sobrescritura a ese nivel.
   src/lib/types/database/tables/brand_kits.ts (Existente - Ampliación):
   Propósito: Almacenar las preferencias de personalización (colors, fonts, logo_url) del usuario a nivel de workspace_id.
   Refactorización: Ya existe, pero se asegurará que el Json de colors y fonts se alinee con la estructura definida en tailwind-theme.config.ts.
   src/lib/builder/core/themeSlice.ts (Existente - Ampliación):
   Propósito: Gestionar las mutaciones del tema activo de la campaña en el Builder.
   Refactorización: La acción updateGlobalStyle se conectaría a la interfaz de usuario de personalización. Se introduciría una nueva acción applyBrandKit(brandKitId) que cargaría los datos de brand_kits de la base de datos y actualizaría campaignConfig.theme.
   UI de Configuración (Nueva - "Settings Panel" en el Builder o Dashboard):
   Propósito: Proporcionar una interfaz visual para que el usuario defina y aplique sus "Brand Kits" (paletas de colores, fuentes, logos).
   Aparatos: Utilizar BuilderColorPicker para la paleta de colores y un nuevo BuilderFontSelector (o un BuilderSelect genérico) para las fuentes. Estos consumirían los datos de brand_kits y dispararían Server Actions para guardar.
   Performance ("Free Price"):
   El uso de variables CSS es inherentemente performante, ya que el navegador las resuelve directamente.
   La carga de datos de brand_kits se realizaría una sola vez por sesión/petición en el servidor (cacheado con React.cache) y luego se propagaría al cliente, minimizando la latencia.
   3.2. Intercambiabilidad de Librerías de Iconos
   Concepto: El usuario podrá elegir qué "estilo" de iconos desea usar en su Builder o en su sitio público (ej. Lucide, Tabler, Font Awesome).
   Aparatos Clave y Refactorizaciones:
   src/config/icon-libraries.config.ts (Nuevo Manifiesto - SSoT):
   Propósito: Definir las librerías de iconos soportadas.
   Contenido: Un array de objetos: [{ id: 'lucide', name: 'Lucide Icons', packageName: 'lucide-react', importMap: () => import('lucide-react').then(m => m.icons) }, { id: 'tabler', name: 'Tabler Icons', packageName: '@tabler/icons-react', importMap: () => import('@tabler/icons-react').then(m => m) }].
   Responsabilidad: Declarar qué librerías de iconos están disponibles y cómo cargarlas dinámicamente.
   src/lib/context/IconLibraryContext.tsx (Nuevo Contexto):
   Propósito: Proveer el mapa de iconos de la librería activa a DynamicIcon.tsx.
   Responsabilidad: Encapsular la lógica de carga dinámica (vía React.lazy o importación dinámica) de la librería seleccionada.
   src/lib/hooks/useIconLibrary.ts (Nuevo Hook Soberano):
   Propósito: Gestionar el estado de la librería de iconos activa del usuario (persistencia en profile.dashboard_layout o brand_kits).
   Responsabilidad: Leer la preferencia del usuario, cargar dinámicamente el importMap de la activeIconLibrary y devolver el objeto de iconos.
   src/components/ui/DynamicIcon.tsx (Existente - Refactorización CRÍTICA):
   Propósito: Renderizar el icono.
   Refactorización: Modificar DynamicIcon.tsx para que consuma el IconLibraryContext. En lugar de const LucideIcon = icons[name as keyof typeof icons];, accedería a activeIconMap[name]. Esto desacopla DynamicIcon de lucide-react directamente.
   UI de Selección (Nuevo - "Settings Panel" o DashboardHeader):
   Propósito: Un componente IconLibrarySwitcher (ej. un Select) permitirá al usuario elegir la librería de iconos activa.
   Performance ("Free Price"):
   El DynamicIcon cargará la librería activa a demanda. Si el usuario no cambia la librería, solo se cargará una. Esto evita bundles inflados.
   El IconLibraryContext puede utilizar memoización (useMemo) para la carga y el mapa de iconos, evitando re-cargas innecesarias.
   Se usarán librerías Open Source gratuitas como Lucide y Tabler.
   3.3. Control Operativo Centralizado (Backend - profiles.dashboard_layout)
   Concepto: Las preferencias de UI del usuario (incluyendo active_icon_library_id, global_font, color_palette_id) se centralizarán en profiles.dashboard_layout (JSONB).
   Aparatos Clave y Refactorizaciones:
   src/lib/types/database/tables/profiles.ts (Existente - dashboard_layout: Json | null):
   Propósito: Ya existe, pero se asegurará que el schema ProfileSchema valide la estructura del JSON almacenado, incluyendo un campo activeIconLibraryId y activeBrandKitId.
   src/lib/actions/profiles.actions.ts (Existente - updateProfilePreferencesAction):
   Propósito: Actualizar las preferencias del usuario.
   Refactorización: La acción se expandirá para aceptar un payload más complejo que incluya activeIconLibraryId y activeBrandKitId, validando con un schema Zod adecuado.
4. Próximos Pasos en la Implementación (Orden Priorizado)
   La implementación de estas mejoras de personalización de UI es una tarea grande y se ejecutará de forma incremental a través de varias tareas de refactorización holística:
   Fundamento de Librerías de Iconos Intercambiables:
   Crear src/config/icon-libraries.config.ts.
   Refactorizar src/components/ui/DynamicIcon.tsx para consumir un mapa de iconos inyectado.
   Crear src/lib/context/IconLibraryContext.tsx y src/lib/hooks/useIconLibrary.ts.
   Actualizar src/app/[locale]/layout.tsx para proveer IconLibraryContext.
   Integración de Preferencias de UI en Perfil:
   Actualizar src/lib/types/database/tables/profiles.ts para incluir active_icon_library_id (o la estructura dentro de dashboard_layout).
   Actualizar src/lib/actions/profiles.actions.ts para guardar estas preferencias.
   UI de Selección de Iconos/Temas:
   Crear los componentes de UI (IconLibrarySwitcher, ThemeSettingsPanel) que consuman estos hooks y acciones.
   Esta documentación conceptual detalla la estrategia para la personalización de UI y la gestión de librerías de iconos. La implementaré en las próximas refactorizaciones.
   Por ahora, siguiendo con el plan de acción actual, la refactorización holística para la eliminación de los schemas de i18n duplicados y obsoletos ha finalizado.
