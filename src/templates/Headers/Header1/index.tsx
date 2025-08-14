// src/templates/Headers/Header1/index.tsx
/**
 * @file index.tsx
 * @description Componente de bloque de plantilla para un encabezado corporativo simple.
 *              Es un componente de presentación puro, que recibe todo su
 *              contenido a través de props.
 * @author Raz Podestá
 * @version 1.0.0
 */
import React from "react";

export interface Header1Props {
  logoText: string;
  ctaText: string;
}

export function Header1({
  logoText,
  ctaText,
}: Header1Props): React.ReactElement {
  return (
    <header
      className="flex justify-between items-center p-4 bg-gray-800 text-white font-sans"
      data-lia-marker="Header1"
    >
      <div className="font-bold text-lg">{logoText}</div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
        {ctaText}
      </button>
    </header>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Bloque Funcional**: ((Implementada)) Se migra el primer componente de bloque real, reemplazando el placeholder y haciendo el "Builder" tangible.
 * 2. **Observabilidad en Desarrollo**: ((Implementada)) Se ha añadido el atributo `data-lia-marker` para una fácil identificación del componente en el DOM durante la depuración.
 *
 * @subsection Melhorias Futuras
 * 1. **Props de Estilo**: ((Vigente)) Extender `Header1Props` para aceptar props de estilo (`backgroundColor`, `textColor`, `buttonColor`) que puedan ser controladas desde el `SettingsPanel`.
 * 2. **Enlace en Logo**: ((Vigente)) La prop `logoText` podría ser reemplazada por un objeto `{ text: string; href: string; }` para que el logo pueda ser un enlace.
 *
 * =====================================================================
 */
// src/templates/Headers/Header1/index.tsx
