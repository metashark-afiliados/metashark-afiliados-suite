// src/components/dev-console/sidebar/sidebar.config.ts
/**
 * @file sidebar.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para los
 *              enlaces de navegación del Dev Console. Contrato de tipo blindado.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { Home, LayoutGrid, FileText, Users, Waypoints } from "lucide-react";
// --- INICIO DE CORRECCIÓN DE CONTRATO ---
import { type Route } from "@/lib/navigation";
// --- FIN DE CORRECCIÓN DE CONTRATO ---

interface DevConsoleNavLink {
  href: Route; // <-- TIPO BLINDADO
  i18nKey: string;
  icon: React.ElementType;
}

export const devConsoleNavLinks: DevConsoleNavLink[] = [
  { href: "/dev-console", i18nKey: "overview", icon: Home },
  { href: "/dev-console/users", i18nKey: "userManagement", icon: Users },
  {
    href: "/dev-console/campaigns",
    i18nKey: "campaignViewer",
    icon: LayoutGrid,
  },
  { href: "/dev-console/telemetry", i18nKey: "telemetry", icon: Waypoints },
  { href: "/dev-console/logs", i18nKey: "auditLogs", icon: FileText },
];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Seguridad de Tipos de Élite**: ((Implementada)) El `href` ahora está fuertemente tipado con `Route`, garantizando que solo rutas válidas definidas en `@/lib/navigation` puedan ser añadidas a este manifiesto. Esto resuelve el error TS2322 en su origen.
 *
 * =====================================================================
 */
// src/components/dev-console/sidebar/sidebar.config.ts
