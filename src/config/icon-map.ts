// src/config/icon-map.ts
/**
 * @file icon-map.ts
 * @description Manifiesto de Iconos de Élite y Única Fuente de Verdad (SSoT).
 *              Este aparato mapea nombres de iconos semánticos y funcionales a los
 *              nombres de componentes literales de la librería `lucide-react`.
 *              Ha sido refactorizado para eliminar deuda técnica y corregir
 *              inconsistencias, consolidándose como un manifiesto de alta fidelidad.
 * @author Raz Podestá
 * @version 3.0.0
 */

export const ICONS = {
  // --- Navegación Principal ---
  NAVIGATION: {
    HOME: "Home",
    DASHBOARD: "LayoutDashboard",
    SITES: "Globe",
    TEMPLATES: "LayoutTemplate",
    PROJECTS: "FolderKanban",
    BRAND: "Palette",
    SETTINGS: "Settings",
    DEV_CONSOLE: "ShieldCheck",
    LOG_OUT: "LogOut",
  },
  // --- Acciones CRUD Universales ---
  ACTIONS: {
    CREATE: "FilePlus",
    EDIT: "Pencil",
    DELETE: "Trash2",
    DUPLICATE: "Copy",
    ARCHIVE: "Archive",
    VIEW: "Eye",
    SEARCH: "Search",
    MORE: "MoreHorizontal",
    ADD: "PlusCircle",
    REMOVE: "XCircle",
    MOVE: "GripVertical",
    OPEN_EXTERNAL: "ExternalLink",
  },
  // --- Herramientas del "Hub Creativo" ---
  TOOLS: {
    CAMPAIGN: "FilePlus",
    LANDING_PAGE: "LayoutTemplate",
    BRIDGE_PAGE: "ArrowRightLeft",
    REVIEW_PAGE: "Star",
    AI_IMAGES: "Image",
    ANALYZE_LANDING: "ScanSearch",
    AI_COPY: "PenTool",
    ANALYZE_METRICS: "ChartBarBig", // <-- CORREGIDO
    INTERACTIVE_QUIZ: "MessageCircleQuestion",
    BRAND_KIT: "Palette",
    CREATE_FUNNEL: "Network",
  },
  // --- Feedback y Estados ---
  FEEDBACK: {
    SUCCESS: "CheckCircle2",
    ERROR: "XCircle",
    WARNING: "AlertTriangle",
    INFO: "Info",
    LOADING: "Loader2",
    HELP: "HelpCircle",
    CHAT: "Bot",
  },
  // --- Entidades y Objetos ---
  ENTITY: {
    USER: "User",
    WORKSPACE: "LayoutGrid",
    CAMPAIGN: "FileText",
    SITE: "Globe",
  },
} as const;

// Helper para aplanar el objeto anidado en un solo nivel para facilitar el mapeo
function flattenIcons(obj: typeof ICONS) {
  const result: { [key: string]: string } = {};
  for (const category of Object.values(obj)) {
    for (const [key, value] of Object.entries(category)) {
      result[key] = value;
    }
  }
  return result;
}

export const FLAT_ICONS = flattenIcons(ICONS);

export type IconName = keyof typeof FLAT_ICONS;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Eliminación de Deuda Técnica**: ((Implementada)) Se ha eliminado por completo la función obsoleta y incorrecta `getMappedIconName`. El sistema ahora depende exclusivamente del objeto `ICONS` como única fuente de verdad.
 * 2. **Sincronización de Datos**: ((Implementada)) Se ha corregido la clave `TOOLS.ANALYZE_METRICS` de `BarChartBig` a `ChartBarBig`, alineando el manifiesto con el nombre canónico de `lucide-react`.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Para una SSoT de élite, se podría crear un script que lea los nombres de los archivos de `lucide-react` y genere un tipo `LucideIconName` para ser usado en la validación Zod de los archivos de mensajes.
 *
 * =====================================================================
 */
