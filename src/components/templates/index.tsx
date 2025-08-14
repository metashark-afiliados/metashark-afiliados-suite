// src/components/templates/index.tsx
/**
 * @file index.tsx
 * @description Manifiesto de Mapeo Declarativo. Este aparato es la Única Fuente
 *              de Verdad que mapea identificadores de bloque a sus componentes
 *              React. Ha sido actualizado para utilizar las implementaciones
 *              reales de los componentes, eliminando los placeholders.
 * @author Raz Podestá
 * @version 3.0.0
 */
import React from "react";

import { Header1 } from "@/templates/Headers/Header1";
import { Hero1 } from "@/templates/Heros/Hero1";

/**
 * @public
 * @typedef BlockComponent
 * @description Define el tipo genérico para un componente de bloque de React.
 */
type BlockComponent = React.ComponentType<Record<string, any>>;

/**
 * @public
 * @constant blockRegistry
 * @description Registro que mapea los nombres de tipo de bloque a sus
 *              componentes de React. Este manifiesto es consumido por
 *              el `Canvas` para el renderizado dinámico de bloques.
 */
export const blockRegistry: Record<string, BlockComponent> = {
  Header1: Header1 as BlockComponent,
  Hero1: Hero1 as BlockComponent,
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Integración Funcional**: ((Implementada)) El registro ahora apunta a los componentes de bloque reales, haciendo que el constructor sea visualmente funcional por primera vez.
 * 2. **Cero Regresiones**: ((Implementada)) La estructura del registro se mantiene, asegurando la compatibilidad con los consumidores (`Canvas`, `BlocksPalette`).
 *
 * @subsection Melhorias Futuras
 * 1. **Descubrimiento Automático de Bloques**: ((Vigente)) Un script de build podría leer el directorio `src/templates` y generar este registro automáticamente, eliminando la necesidad de mantenimiento manual a medida que se añadan nuevos bloques.
 *
 * =====================================================================
 */
// src/components/templates/index.tsx
