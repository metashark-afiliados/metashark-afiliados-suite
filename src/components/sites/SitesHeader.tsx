/**
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-29
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";

import { ResourcePageHeader } from "@/components/shared/ResourcePageHeader";
import { clientLogger } from "@/lib/logging";

import {
  SitesHeaderActions,
  type SitesHeaderActionsProps,
} from "./SitesHeaderActions";
import { SitesPageTitle } from "./SitesPageTitle";

export type SitesHeaderProps = SitesHeaderActionsProps;

/**
 * @public
 * @component SitesHeader
 * @description Orquestador de UI de élite para el encabezado de "Mis Sitios".
 *              Delega la lógica de layout al componente genérico `ResourcePageHeader`,
 *              actuando como un ensamblador puro que compone sus aparatos hijos
 *              (`SitesPageTitle` y `SitesHeaderActions`).
 * @param {SitesHeaderProps} props - Propiedades para configurar el encabezado.
 * @returns {React.ReactElement}
 */
export function SitesHeader(props: SitesHeaderProps): React.ReactElement {
  clientLogger.trace(
    "[SitesHeader] Renderizando orquestador de UI que consume la abstracción."
  );

  return (
    <ResourcePageHeader
      titleSlot={<SitesPageTitle />}
      actionsSlot={<SitesHeaderActions {...props} />}
    />
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Encabezado (`SitesHeaderContext`)**: ((Vigente)) Para una pureza arquitectónica de élite y para eliminar el "prop drilling", las numerosas props podrían ser encapsuladas en un hook `useSitesHeader` y proveídas a través de un contexto, permitiendo que los componentes hijos accedan al estado y a las acciones sin que cada intermediario deba pasar las props.
 *
 * =====================================================================
 */
