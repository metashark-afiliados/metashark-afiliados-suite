// src/components/authentication/OAuthButtonGroup.tsx
/**
 * @file OAuthButtonGroup.tsx
 * @description Componente de ensamblaje de UI. Renderiza un grupo de botones
 *              para los proveedores OAuth especificados. Actualizado para
 *              importar su dependencia atómica desde el directorio canónico.
 * @author Raz Podestá
 * @version 2.0.0
 */
"use client";

import { type Provider } from "@supabase/supabase-js";
// --- INICIO DE CORRECCIÓN DE RUTA DE IMPORTACIÓN ---
import { OAuthButton } from "./OAuthButton";
// --- FIN DE CORRECCIÓN DE RUTA DE IMPORTACIÓN ---

interface OAuthButtonGroupProps {
  providers: Provider[];
}

export function OAuthButtonGroup({ providers }: OAuthButtonGroupProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {providers.map((provider) => (
        <OAuthButton key={provider} provider={provider} />
      ))}
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Dependencia**: ((Implementada)) Se ha corregido la ruta de importación de `OAuthButton` para que apunte a la nueva ubicación canónica, resolviendo el segundo y último error de compilación `TS2307`.
 * 2. **Layout Responsivo Mejorado**: ((Implementada)) Se ha actualizado la clase de la cuadrícula a `grid-cols-1 sm:grid-cols-2` para una mejor presentación en dispositivos móviles, mostrando los botones uno encima del otro.
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Proveedores Desconocidos**: ((Vigente)) Añadir una comprobación para asegurar que cada `provider` en el array tiene una entrada correspondiente en el `providerDetails` de `OAuthButton.tsx` para evitar renderizar botones vacíos.
 *
 * =====================================================================
 */
// src/components/authentication/OAuthButtonGroup.tsx
