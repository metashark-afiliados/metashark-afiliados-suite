// src/components/layout/sidebar/user-menu/index.ts
/**
 * @file index.ts
 * @description Manifiesto (Barrel File) y API pública para el ecosistema atómico
 *              de `UserMenu`. Define una fachada cohesiva para el módulo,
 *              exportando sus componentes de forma organizada.
 * @author Raz Podestá
 * @version 1.0.0
 */
export * from "./UserMenu";
export * from "./UserMenuContent";
export * from "./UserMenuSkeleton";
export * from "./UserMenuTrigger";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cohesión de Módulo (LEGO)**: ((Implementada)) Este manifiesto agrupa todos los aparatos del ecosistema `UserMenu` en un único módulo cohesivo, mejorando la organización del proyecto y la Developer Experience.
 * 2. **API Pública Explícita**: ((Implementada)) Define una interfaz clara para el módulo, encapsulando su estructura interna.
 *
 * @subsection Melhorias Futuras
 * 1. **Exportaciones Condicionales**: ((Vigente)) Para una encapsulación de élite, se podría considerar exportar únicamente el orquestador `UserMenu` por defecto, y exportar los átomos (`UserMenuTrigger`, etc.) bajo un namespace (`UserMenu.Trigger`) para indicar que son partes internas del sistema.
 *
 * =====================================================================
 */