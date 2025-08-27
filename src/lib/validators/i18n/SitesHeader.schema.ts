// src/lib/validators/i18n/SitesHeader.schema.ts
/**
 * @file SitesHeader.schema.ts
 * @description Aparato de validación atómico y SSoT para el namespace
 *              'components.sites.SitesHeader'. Ha sido enriquecido para incluir
 *              claves para tooltips, completando el contrato de datos para una UX de élite.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import { z } from "zod";

export const SitesHeaderSchema = z.object({
  title: z
    .string()
    .describe("El título principal de la página, ej. 'Mis Sitios'"),
  description: z.string().describe("La descripción o subtítulo de la página."),
  searchPlaceholder: z
    .string()
    .describe("El texto del placeholder para la barra de búsqueda."),
  clearSearchAria: z
    .string()
    .describe("Texto accesible para el botón de limpiar búsqueda."),
  createSiteButton: z
    .string()
    .describe("Texto para el botón principal de creación."),
  createDialogTitle: z
    .string()
    .describe("Título para el modal de creación de sitio."),
  viewGridAria: z
    .string()
    .describe("Texto accesible para el botón de vista de cuadrícula."),
  viewListAria: z
    .string()
    .describe("Texto accesible para el botón de vista de lista."),
  viewGridTooltip: z
    .string()
    .describe("Texto del tooltip para el botón de vista de cuadrícula."),
  viewListTooltip: z
    .string()
    .describe("Texto del tooltip para el botón de vista de lista."),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de UX Enriquecido**: ((Implementada)) Se han añadido las claves `viewGridTooltip` y `viewListTooltip` al schema, implementando directamente la directiva y estableciendo el contrato de datos necesario para una UI más informativa y accesible.
 * 2. **Atomicidad de Contrato (SRP)**: ((Vigente)) Este aparato aísla perfectamente el contrato de datos para el componente `SitesHeader`, cumpliendo con el Principio de Responsabilidad Única.
 *
 * @subsection Melhorias Futuras
 * 1. **Namespace Dedicado**: ((Pendiente)) Para una atomicidad de élite, el archivo de mensajes debería ser dividido de la misma manera, creando un `SitesHeader.json`. Propondré esta refactorización completa en la siguiente fase.
 *
 * =====================================================================
 */
// src/lib/validators/i18n/SitesHeader.schema.ts
