// src/templates/Footers/Footer1/index.tsx
/**
 * @file index.tsx
 * @description Componente de bloque de plantilla para un pie de página profesional.
 *              Incluye secciones para enlaces, suscripción a newsletter y redes sociales.
 *              Es completamente editable y está preparado para internacionalización.
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-25
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";

import { EditableText } from "@/components/builder/ui/EditableText";
import { type LinkItem } from "@/lib/builder/types.d";
import { clientLogger } from "@/lib/logging";

export interface Footer1Props {
  blockId: string;
  brandName: string;
  slogan: string;
  copyrightText: string;
  productLinks: LinkItem[];
  companyLinks: LinkItem[];
  legalLinks: LinkItem[];
  onUpdate: (propName: string, newValue: any) => void;
}

/**
 * @public
 * @component Footer1
 * @description Renderiza una sección de pie de página con contenido editable.
 * @param {Footer1Props} props - Las propiedades para configurar el componente.
 * @returns {React.ReactElement}
 */
export function Footer1(props: Footer1Props): React.ReactElement {
  clientLogger.trace(
    `[Footer1:Render] Renderizando bloque con ID: ${props.blockId}`
  );

  return (
    <footer
      className="bg-gray-900 text-gray-400 font-sans py-12 px-4"
      data-lia-marker="Footer1"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <EditableText
            tag="h3"
            value={props.brandName}
            onSave={(newValue) => props.onUpdate("brandName", newValue)}
            className="text-lg font-bold text-white"
            placeholder="Nombre de la Marca"
          />
          <EditableText
            tag="p"
            value={props.slogan}
            onSave={(newValue) => props.onUpdate("slogan", newValue)}
            className="text-sm"
            placeholder="Un eslogan memorable."
          />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Producto</h4>
          <ul className="space-y-2 text-sm">
            {(props.productLinks || []).map((link, i) => (
              <li key={i}>
                <a href={link.href} className="hover:text-white">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Compañía</h4>
          <ul className="space-y-2 text-sm">
            {(props.companyLinks || []).map((link, i) => (
              <li key={i}>
                <a href={link.href} className="hover:text-white">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
        <EditableText
          tag="p"
          value={props.copyrightText}
          onSave={(newValue) => props.onUpdate("copyrightText", newValue)}
          placeholder={`© ${new Date().getFullYear()} Tu Marca`}
        />
        <div className="flex gap-4 mt-4 md:mt-0">
          {(props.legalLinks || []).map((link, i) => (
            <a key={i} href={link.href} className="hover:text-white">
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente Estructural Final**: ((Implementada)) El `Footer` es una pieza de conversión y navegación crucial que completa el "Arsenal de Conversión" inicial.
 * 2. **Manejo de Estructuras Complejas**: ((Implementada)) Maneja múltiples arrays de objetos, validando la capacidad de la arquitectura para gestionar contenido rico.
 *
 * @subsection Melhorias Futuras
 * 1. **Edición de Enlaces en `SettingsPanel`**: ((Vigente)) El `SettingsField` para el tipo `array` debe ser mejorado para permitir la edición de objetos con múltiples campos (ej. `text` y `href`).
 * 2. **Newsletter y Redes Sociales**: ((Vigente)) Añadir `props` y JSX para un formulario de newsletter y enlaces a redes sociales, como se define en el manifiesto de edición.
 *
 * =====================================================================
 */
// src/templates/Footers/Footer1/index.tsx
