// src/components/builder/ui/IFrame.tsx
/**
 * @file IFrame.tsx
 * @description Componente de infraestructura de élite. Crea un `<iframe>` para un
 *              aislamiento completo de estilos y scripts, inyectando estilos de
 *              tema dinámicos. Es el núcleo del renderizado seguro del Canvas.
 * @author Raz Podestá
 * @version 1.0.0
 */
"use client";

import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { type CampaignTheme } from "@/lib/builder/types.d";

/**
 * @public
 * @interface IFrameProps
 * @description Contrato de props para el componente IFrame.
 */
export interface IFrameProps {
  children: React.ReactNode;
  theme: CampaignTheme;
}

/**
 * @public
 * @component IFrame
 * @description Crea un `iframe` y porta el contenido React a su `document`,
 *              garantizando un "sandbox" visual completo.
 * @param {IFrameProps} props - Propiedades del componente.
 * @returns {React.ReactElement}
 */
export function IFrame({ children, theme }: IFrameProps): React.ReactElement {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const headNode = contentRef?.contentWindow?.document?.head;

  const themeCss = useMemo(() => {
    const colorVariables = Object.entries(theme.globalColors || {})
      .map(([name, value]) => `--theme-${name}: ${value};`)
      .join("\n");

    return `
      :root { ${colorVariables} }
      body {
        margin: 0;
        font-family: "${theme.globalFont || "sans-serif"}";
        background-color: #ffffff;
      }
    `;
  }, [theme]);

  return (
    <iframe
      ref={setContentRef}
      className="w-full h-full border-0"
      title="Campaign Preview"
    >
      {headNode && createPortal(<style>{themeCss}</style>, headNode)}
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aislamiento de Estilos de Élite**: ((Implementada)) El uso de `iframe` y `createPortal` es la solución canónica para prevenir conflictos de CSS entre la aplicación y el contenido del usuario.
 * 2. **Inyección de Tema Dinámico**: ((Implementada)) Inyecta los estilos del tema de la campaña directamente en el `<head>` del iframe, permitiendo una previsualización de alta fidelidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Inyección de Scripts**: ((Vigente)) Se podría extender para inyectar scripts de seguimiento o fuentes externas en el `<head>` del iframe.
 *
 * =====================================================================
 */
// src/components/builder/ui/IFrame.tsx
