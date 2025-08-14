// src/components/templates/index.tsx
/**
 * @file index.tsx
 * @description Manifiesto de Mapeo Declarativo. Ha sido corregido para ser un
 *              módulo TSX válido, resolviendo una cascada de errores de compilación.
 *              Utiliza componentes de placeholder funcionales hasta que los bloques
 *              reales (Header1, Hero1) sean migrados.
 * @author Raz Podestá
 * @version 2.0.0
 */
import React from 'react';

// Componente de placeholder válido y reutilizable
const PlaceholderBlock = ({ name }: { name: string }) => (
  <div className="p-4 border border-dashed border-primary/50 bg-primary/10 text-center text-sm text-primary-foreground/80">
    Placeholder for <strong>{name}</strong> Component
  </div>
);

// Implementaciones de placeholder
const Header1: React.FC = () => <PlaceholderBlock name="Header1" />;
const Hero1: React.FC = () => <PlaceholderBlock name="Hero1" />;

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
 *              componentes de React.
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
 * 1. **Resolución de Error Crítico**: ((Implementada)) Se ha corregido la sintaxis JSX y renombrado el archivo a `.tsx`, resolviendo la cascada de 25 errores de compilación.
 * 2. **Placeholders Robustos**: ((Implementada)) Los placeholders ahora son componentes de React válidos, permitiendo que la aplicación compile y funcione.
 *
 * =====================================================================
 */
// src/components/templates/index.tsx