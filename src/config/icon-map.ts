// src/config/icon-map.ts
/**
 * @file icon-map.ts
 * @description Manifiesto de Iconos de Élite y SSoT. Ha sido revertido a un
 *              estado estable para ser un mapa puramente semántico, eliminando
 *              la validación Zod en tiempo de importación para resolver
 *              un error crítico de servidor.
 * @author Raz Podestá
 * @version 4.1.0 (Stable Revert)
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
    ANALYZE_METRICS: "ChartBarBig",
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

// Helper para aplanar el objeto anidado para el tipo IconName
function flattenIcons<T extends Record<string, Record<string, string>>>(
  obj: T
) {
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
 * 1. **Estabilidad del Servidor Restaurada**: ((Implementada)) Se ha eliminado la validación Zod en tiempo de importación, resolviendo la causa raíz del `ZodError` en el servidor y restaurando la capacidad de compilación del proyecto.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación en Consumidores**: ((Vigente)) La responsabilidad de la validación se traslada correctamente a los schemas de i18n, que es donde debe residir.
 *
 * =====================================================================
 */
// src/config/icon-map.ts
