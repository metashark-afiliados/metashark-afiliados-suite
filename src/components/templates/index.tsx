// src/components/templates/index.tsx
/**
 * @file index.tsx
 * @description Manifiesto de Mapeo Declarativo. Este aparato es la Única Fuente
 *              de Verdad que mapea identificadores de bloque a sus componentes
 *              React. Sincronizado para incluir la plantilla `Features1`.
 * @author Raz Podestá
 * @version 3.0.0
 */
import React from "react";

// --- INICIO DE SINCRONIZACIÓN ---
import { Features1 } from "@/templates/Features/Features1";
// --- FIN DE SINCRONIZACIÓN ---
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
  Features1: Features1 as BlockComponent, // <-- NUEVO REGISTRO
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Expansión de Capacidad de Renderizado**: ((Implementada)) El `Canvas` ahora es capaz de renderizar el bloque `Features1`, expandiendo el "vocabulario" visual del constructor.
 *
 * @subsection Melhorias Futuras
 * 1. **Descubrimiento Automático de Bloques**: ((Vigente)) Un script de build podría leer el directorio `src/templates` y generar este registro automáticamente, eliminando la necesidad de mantenimiento manual.
 *
 * =====================================================================
 */
// src/components/templates/index.tsx
