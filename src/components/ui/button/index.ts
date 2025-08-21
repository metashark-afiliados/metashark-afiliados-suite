// src/components/ui/button/index.ts
/**
 * @file index.ts
 * @description Manifiesto público y único punto de entrada para el ecosistema Button.
 *              Exporta el componente compuesto `Button`, sus contratos de tipos y
 *              la SSoT de variantes para usos avanzados.
 * @author L.I.A. Legacy
 * @version 9.0.0
 */
export { Button, type ButtonProps } from "./Button";
export { buttonVariants, type ButtonVariantsProps } from "./variants";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Encapsulación de Módulo**: ((Implementada)) Este manifiesto define una API pública clara, ocultando las primitivas internas y mejorando la cohesión del ecosistema.
 *
 * @subsection Melhorias Futuras
 * 1. **Exportación de Primitivas**: ((Vigente)) Para casos de uso extremadamente personalizados, se podría considerar exportar las primitivas (`ButtonBase`, etc.) como propiedades adicionales del objeto `Button`.
 *
 * =====================================================================
 */
// src/components/ui/button/index.ts
