// src/config/icon-libraries.config.ts
/**
 * @file icon-libraries.config.ts
 * @description Manifiesto de Configuración Declarativo y Única Fuente de Verdad (SSoT)
 *              para las librerías de iconos. Refactorizado para que `importFn`
 *              devuelva una factoría de cargadores compatible con `next/dynamic`.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-30
 */
import { type LucideIconName } from "@/config/lucide-icon-names";

export type TablerIconName = string; // Placeholder

export interface IconLibraryDefinition {
  id: "lucide" | "tabler" | "react-icons";
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
        // Fallback si el icono no existe en la librería
        return mod.HelpCircle;
      }),
  },
  // La lógica para otras librerías seguiría un patrón similar
];
// src/config/icon-libraries.config.ts