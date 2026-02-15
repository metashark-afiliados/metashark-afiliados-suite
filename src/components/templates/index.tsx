// src/components/templates/index.tsx
/**
 * @file index.tsx
 * @description Manifiesto de Mapeo Declarativo y SSoT para componentes de
 *              plantilla. Ha sido refactorizado para utilizar rutas de importación
 *              canónicas que apuntan a directorios, resolviendo una cascada de
 *              errores de resolución de módulos.
 * @author Raz Podestá - MetaShark Tech
 * @version 6.1.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";

// --- INICIO DE CORRECCIÓN DE RUTAS DE IMPORTACIÓN ---
import { Features1 } from "@/templates/Features/Features1";
import { Footer1 } from "@/templates/Footers/Footer1";
import { Header1 } from "@/templates/Headers/Header1";
import { Hero1 } from "@/templates/Heros/Hero1";
import { Testimonials1 } from "@/templates/Testimonials/Testimonials1";
// --- FIN DE CORRECCIÓN DE RUTAS DE IMPORTACIÓN ---

type BlockComponent = React.ComponentType<Record<string, any>>;

export const blockRegistry: Record<string, BlockComponent> = {
  Header1: Header1 as BlockComponent,
  Hero1: Hero1 as BlockComponent,
  Features1: Features1 as BlockComponent,
  Testimonials1: Testimonials1 as BlockComponent,
  Footer1: Footer1 as BlockComponent,
};
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Build (TS2305)**: ((Implementada)) Se han corregido todas las rutas de importación para que apunten a los directorios de los componentes (ej. `@/templates/Headers/Header1`), eliminando el `/index` redundante y resolviendo el error crítico de resolución de módulos.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Dinámica de Componentes**: ((Vigente)) Para una optimización de élite, los componentes de bloque podrían ser importados dinámicamente (`React.lazy`).
 *
 * =====================================================================
 */
// src/components/templates/index.tsx
