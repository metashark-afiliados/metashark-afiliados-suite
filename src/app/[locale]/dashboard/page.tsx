// src/app/[locale]/dashboard/page.tsx
/**
 * @file src/app/[locale]/dashboard/page.tsx
 * @description Punto de entrada del servidor para el dashboard. Alineado con la
 *              arquitectura canónica, su única responsabilidad es ensamblar el
 *              componente de cliente que renderiza la UI del dashboard.
 * @author Raz Podestá
 * @version 9.2.0
 */
import { logger } from "@/lib/logging";
import { DashboardClient } from "./dashboard-client";

/**
 * @public
 * @page DashboardPage
 * @description Ensambla el componente de cliente del dashboard.
 * @returns {JSX.Element}
 */
export default function DashboardPage(): JSX.Element {
  logger.trace("[DashboardPage] Renderizando punto de entrada del servidor.");
  return <DashboardClient />;
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Restauración de Contenido**: ((Implementada)) Se ha restaurado el código React válido, resolviendo el `Syntax Error` crítico.
 *
 * =====================================================================
 */
// src/app/[locale]/dashboard/page.tsx