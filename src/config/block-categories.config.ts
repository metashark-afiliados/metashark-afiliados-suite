// src/config/icon-libraries.config.ts
/**
 * @file icon-libraries.config.ts
 * @description Manifiesto de Configuración Declarativo y SSoT para las librerías de iconos.
 *              Refactorizado a un estándar de élite con una SSoT de tipos literal (`as const`)
 *              para garantizar la inferencia de tipos correcta en toda la aplicación.
 * @author L.I.A. Legacy & RaZ Podestá (Arquitecto)
 * @version 3.0.0
 */
import { type LucideIconName } from "@/config/lucide-icon-names";

/**
 * @public
 * @constant ICON_LIBRARY_IDS
 * @description La Única Fuente de Verdad (SSoT) para los identificadores de
 *              librerías de iconos. El uso de `as const` es crítico para que
 *              TypeScript infiera un tuple de literales inmutables.
 */
export const ICON_LIBRARY_IDS = ["lucide", "tabler", "react-icons"] as const;

/**
 * @public
 * @typedef IconLibraryId
 * @description El tipo de unión de literales para los IDs de librerías de iconos,
 *              derivado directamente de la SSoT `ICON_LIBRARY_IDS`.
 */
export type IconLibraryId = (typeof ICON_LIBRARY_IDS)[number];

export interface IconLibraryDefinition {
  id: IconLibraryId;
  name: string;
  packageName: string;
  importFn: (name: string) => () => Promise<React.ComponentType<any>>;
}

export const ICON_LIBRARIES_MANIFEST: IconLibraryDefinition[] = [
  {
    id: "lucide",
    name: "Lucide Icons",
    packageName: "lucide-react",
    importFn: (name: string) => () =>
      import("lucide-react").then((mod) => {
        if (name in mod.icons) {
          return mod.icons[name as LucideIconName];
        }
        return mod.HelpCircle;
      }),
  },
  // La lógica para otras librerías seguiría un patrón similar
];
// src/config/icon-libraries.config.ts
