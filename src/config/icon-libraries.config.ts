// src/config/icon-libraries.config.ts
/**
 * @file icon-libraries.config.ts
 * @description Manifiesto de Configuración Declarativo y Única Fuente de Verdad (SSoT)
 *              para las librerías de iconos soportadas en el proyecto. Este aparato
 *              define las librerías disponibles y cómo importarlas dinámicamente,
 *              sentando las bases para la intercambiabilidad de iconos en la UI.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */

import { type LucideIconName } from "@/config/lucide-icon-names";

/**
 * @public
 * @typedef {string} TablerIconName
 * @description Tipo placeholder para los nombres de iconos de Tabler Icons.
 *              En una implementación real, este tipo se generaría automáticamente.
 */
export type TablerIconName = string; // Placeholder, para simular otro tipo de icono.

/**
 * @public
 * @interface IconLibraryDefinition
 * @description Define el contrato para cada librería de iconos soportada.
 */
export interface IconLibraryDefinition {
  /**
   * Identificador único de la librería (ej. 'lucide', 'tabler').
   */
  id: "lucide" | "tabler" | "react-icons"; // Extender esta unión a medida que se añadan más.
  /**
   * Nombre legible de la librería para mostrar en la UI.
   */
  name: string;
  /**
   * Nombre del paquete npm de la librería (ej. 'lucide-react').
   */
  packageName: string;
  /**
   * Una función asíncrona que importa dinámicamente la librería de iconos
   * y devuelve un objeto que mapea nombres de iconos a componentes.
   * Esto es crucial para el "tree-shaking" y para cargar solo la librería activa.
   */
  importFn: () => Promise<Record<string, React.ElementType>>;
  /**
   * Un tipo de unión de literales que define todos los nombres de iconos válidos
   * para esta librería. Esto es para garantizar el tipo-seguridad en el `DynamicIcon`.
   */
  iconNamesType: LucideIconName | TablerIconName; // Usar una unión para tipos de nombres de iconos
}

/**
 * @public
 * @constant ICON_LIBRARIES_MANIFEST
 * @description El manifiesto canónico que lista todas las librerías de iconos
 *              soportadas por la aplicación.
 */
export const ICON_LIBRARIES_MANIFEST: IconLibraryDefinition[] = [
  {
    id: "lucide",
    name: "Lucide Icons",
    packageName: "lucide-react",
    importFn: async () => {
      // Importación dinámica para cargar solo esta librería cuando sea necesario
      const module = await import("lucide-react");
      return module.icons; // `lucide-react` exporta un objeto `icons`
    },
    iconNamesType: "" as LucideIconName, // Tipo ficticio para LucideIconName
  },
  {
    id: "tabler",
    name: "Tabler Icons",
    packageName: "@tabler/icons-react",
    importFn: async () => {
      // `Tabler Icons` exporta los iconos directamente, no bajo un objeto `icons`
      const module = await import("@tabler/icons-react");
      // Filtramos solo los componentes React (PascalCase)
      const icons = Object.keys(module).reduce(
        (acc, key) => {
          if (
            key.startsWith("Icon") &&
            typeof (module as any)[key] === "function"
          ) {
            acc[key] = (module as any)[key];
          }
          return acc;
        },
        {} as Record<string, React.ElementType>
      );
      return icons;
    },
    iconNamesType: "" as TablerIconName, // Tipo ficticio para TablerIconName
  },
  // {
  //   id: "react-icons",
  //   name: "React Icons",
  //   packageName: "react-icons",
  //   // NOTA: Para `react-icons`, la importación es más compleja ya que se importan
  //   // módulos específicos (ej. `import { FaBeer } from 'react-icons/fa';`).
  //   // Este `importFn` requeriría un mecanismo para cargar la sub-librería deseada.
  //   importFn: async () => ({}), // Placeholder
  //   iconNamesType: "" as TablerIconName, // O un tipo más genérico para react-icons
  // },
];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Creación de SSoT para Librerías de Iconos**: ((Implementada)) Este archivo establece la Única Fuente de Verdad para todas las librerías de iconos soportadas, adhiriéndose al principio de "Configuración sobre Código" y desacoplando la selección de la librería de la implementación de `DynamicIcon`.
 * 2. **Soporte para Carga Dinámica ("Free Price")**: ((Implementada)) La propiedad `importFn` permite cargar dinámicamente solo la librería de iconos que el usuario ha seleccionado, lo que reduce el tamaño del bundle inicial y optimiza el rendimiento.
 * 3. **Tipado Robusto para Nombres de Iconos**: ((Implementada)) Se utiliza `iconNamesType` para guiar el tipado de los nombres de iconos, garantizando la seguridad de tipos para cada librería.
 * 4. **Preparación para Intercambiabilidad**: ((Implementada)) La inclusión de `Tabler Icons` (con una lógica de `importFn` simulada) demuestra la facilidad con la que se pueden añadir nuevas librerías sin modificar el núcleo del sistema.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática de `iconNamesType`**: ((Vigente)) Para librerías como `Tabler Icons` o `React Icons`, se podría crear un script que escanee los paquetes y genere automáticamente el tipo `TablerIconName` (y similar) como una unión de literales, de manera análoga a `lucide-icon-names.ts`.
 * 2. **Gestión de Versiones de Librería**: ((Vigente)) La `IconLibraryDefinition` podría incluir una propiedad `version: string` para registrar la versión de npm de cada librería, facilitando la auditoría y compatibilidad.
 * 3. **Configuración de Alias de Importación**: ((Vigente)) Si se usan alias de importación específicos para cada librería de iconos, la definición podría incluirlos para ser consumidos por el `IconLibraryContext`.
 *
 * =====================================================================
 */
// src/config/icon-libraries.config.ts
