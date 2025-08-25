// src/templates/Headers/Header1/index.tsx
/**
 * @file index.tsx
 * @description Componente de bloque de plantilla para un encabezado corporativo simple.
 *              Es un componente de presentación puro, que recibe todo su
 *              contenido a través de props y está preparado para la edición en vivo.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { EditableText } from "@/components/builder/ui/EditableText";
import { clientLogger } from "@/lib/logging";

/**
 * @public
 * @interface Header1Props
 * @description Contrato de props para el componente Header1. Incluye las props
 *              inyectadas por el `DraggableBlockWrapper` para la edición en vivo.
 */
export interface Header1Props {
  blockId: string;
  logoText: string;
  ctaText: string;
  onUpdate: (propName: string, newValue: string) => void;
}

/**
 * @public
 * @component Header1
 * @description Renderiza un encabezado corporativo simple con texto y botón editables.
 * @param {Header1Props} props - Las propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function Header1({
  blockId,
  logoText,
  ctaText,
  onUpdate,
}: Header1Props): React.ReactElement {
  clientLogger.trace(`[Header1:Render] Renderizando bloque con ID: ${blockId}`);

  return (
    <header
      className="flex justify-between items-center p-4 bg-gray-800 text-white font-sans"
      data-lia-marker="Header1"
    >
      <EditableText
        tag="div"
        value={logoText}
        onSave={(newValue) => onUpdate("logoText", newValue)}
        className="font-bold text-lg"
        placeholder="Tu Marca"
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
        <EditableText
          tag="span"
          value={ctaText}
          onSave={(newValue) => onUpdate("ctaText", newValue)}
          placeholder="Empezar"
        />
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
 * 1. **Componente de Bloque Funcional**: ((Implementada)) Se crea el primer componente de bloque real y editable, haciendo el "Builder" tangible.
 * 2. **Edición en Vivo (Inline Editing)**: ((Implementada)) La integración con `EditableText` es la implementación canónica de la edición en el `Canvas`, proporcionando una UX de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Props de Estilo**: ((Vigente)) Extender `Header1Props` para aceptar props de estilo (`backgroundColor`, `textColor`, etc.) que puedan ser controladas desde el `SettingsPanel`.
 *
 * =====================================================================
 */
// src/templates/Headers/Header1/index.tsx
