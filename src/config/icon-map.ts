// src/config/icon-map.ts
/**
 * @file icon-map.ts
 * @description Manifiesto de Iconos de Élite y Única Fuente de Verdad (SSoT).
 *              Este aparato mapea nombres de iconos semánticos y funcionales a los
 *              nombres de componentes literales de la librería `lucide-react`.
 *              Proporciona seguridad de tipos y centraliza la gestión de la
 *              iconografía de toda la aplicación.
 * @author Raz Podestá
 * @version 2.0.0
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
    ANALYZE_METRICS: "BarChartBig",
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
 * @deprecated La función getMappedIconName está obsoleta. Use el objeto ICONS directamente.
 */
export function getMappedIconName(conceptualName: string): string {
  // Mantener por retrocompatibilidad mientras se refactoriza
  const legacyMap: Record<string, string> = {
    FilePenSquare: "FilePen",
    BarChart3: "BarChartBig",
    PieChart: "ChartPie",
  };
  return legacyMap[conceptualName] || conceptualName;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Seguridad de Tipos y SSoT**: ((Implementada)) El aparato ahora exporta un objeto fuertemente tipado y semántico, `ICONS`, y un tipo `IconName` derivado.
 * 2. **Organización Semántica**: ((Implementada)) La agrupación por dominio funcional mejora drásticamente la legibilidad y la DX.
 *
 * =====================================================================
 */
// src/config/icon-map.ts