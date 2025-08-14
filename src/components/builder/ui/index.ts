// src/components/builder/ui/index.ts
/**
 * @file src/components/builder/ui/index.ts
 * @description Archivo barril (Barrel File) para exportar componentes de UI atómicos
 *              específicos del constructor. Centraliza las exportaciones de los
 *              inputs de edición del `SettingsPanel`, siguiendo la "Filosofía LEGO"
 *              para una máxima modularidad y facilidad de importación.
 * @author Raz Podestá
 * @version 1.0.0
 */
export * from "./BuilderBooleanSwitch";
export * from "./BuilderColorPicker";
export * from "./BuilderTextAreaInput";
export * from "./BuilderTextInput";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión Arquitectónica**: ((Implementada)) Este manifiesto agrupa los componentes de UI del builder, creando un sub-módulo cohesivo y fácil de consumir, mejorando la organización del proyecto.
 * 2. **Principio de Responsabilidad Única (SRP)**: ((Implementada)) El archivo tiene la única y clara responsabilidad de exportar sus módulos hermanos.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación Automática**: ((Vigente)) Para proyectos con un gran número de componentes, este tipo de archivo barril es un candidato ideal para ser generado y mantenido por un script de build, eliminando la necesidad de actualizaciones manuales.
 *
 * =====================================================================
 */
// src/components/builder/ui/index.ts
