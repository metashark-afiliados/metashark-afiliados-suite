// src/components/builder/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para los componentes del
 *              constructor. Exporta todos los componentes de alto nivel y
 *              ecosistemas del directorio `builder`.
 * @author Raz Podestá
 * @version 1.0.0
 */
export * from "./BlocksPalette";
export * from "./BuilderHeader";
export * from "./Canvas";
export * from "./CreateSiteModal";
export * from "./SettingsField";
export * from "./SettingsGroup";
export * from "./SettingsPanel";
export * from "./SiteAssignmentControl";
export * from "./SiteSelector";

// --- Exportación del Ecosistema DraggableBlock Hiper-Atomizado ---
export * from "./DraggableBlockWrapper";
export * from "./BlockActionsMenu";
export * from "./BlockDragHandle";
