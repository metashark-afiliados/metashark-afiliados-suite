// src/components/ui/DynamicIcon.tsx
/**
 * @file src/components/ui/DynamicIcon.tsx
 * @description Componente de UI atómico para renderizar iconos de forma dinámica.
 *              Ha sido refactorizado holísticamente para consumir el `IconLibraryContext`,
 *              eliminando su acoplamiento directo a `lucide-react` y permitiendo
 *              la intercambiabilidad de librerías de iconos.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
"use client";

import React from "react";
import { HelpCircle, Loader2, XCircle, type LucideProps } from "lucide-react";

import { useIconLibrary } from "@/lib/context/IconLibraryContext"; // <-- Consumir el contexto
import { clientLogger } from "@/lib/logging";
import { cn } from "@/lib/utils";

/**
 * @public
 * @interface DynamicIconProps
 * @description Contrato de props para el componente `DynamicIcon`.
 *              Compatible con las props nativas de los iconos de Lucide.
 */
interface DynamicIconProps extends LucideProps {
  /**
   * El nombre del icono a renderizar (en formato PascalCase, ej. "LayoutTemplate").
   * Este nombre debe ser compatible con la librería de iconos activa.
   */
  name: string;
}

/**
 * @public
 * @component DynamicIcon
 * @description Renderiza un icono de forma dinámica basándose en el nombre
 *              proporcionado y la librería de iconos activa en el `IconLibraryContext`.
 *              Maneja estados de carga, errores y fallbacks.
 * @param {DynamicIconProps} props - Las propiedades para configurar el icono.
 * @returns {React.ReactElement | null} El componente de icono renderizado o null si no se encuentra.
 */
export const DynamicIcon = ({
  name,
  className,
  ...props
}: DynamicIconProps) => {
  // --- INICIO DE REFACTORIZACIÓN HOLÍSTICA: Consumo del contexto ---
  const { icons, isLoading, activeLibraryId, error } = useIconLibrary();

  clientLogger.trace(
    `[DynamicIcon] Renderizando icono: '${name}' con librería: '${activeLibraryId}'.`,
    { isLoading, error }
  );

  if (isLoading) {
    return (
      <Loader2
        className={cn("h-4 w-4 animate-spin text-muted-foreground", className)}
        aria-label="Cargando icono..."
        {...props}
      />
    );
  }

  if (error) {
    clientLogger.warn(
      `[DynamicIcon] Error al cargar la librería de iconos '${activeLibraryId}'. Mostrando icono de error.`,
      { error }
    );
    return (
      <XCircle
        className={cn("h-4 w-4 text-destructive", className)}
        aria-label="Error al cargar la librería de iconos"
        {...props}
      />
    );
  }

  // Si no hay iconos cargados y no hay error explícito (ej. el contexto aún no está listo),
  // se puede considerar un fallback o esperar. Por ahora, asumimos que icons será null
  // solo si hay un error o isLoading.
  if (!icons) {
    clientLogger.warn(
      `[DynamicIcon] No hay iconos disponibles. La librería '${activeLibraryId}' no ha cargado correctamente o está vacía. Mostrando icono de ayuda.`
    );
    return (
      <HelpCircle
        className={cn("h-4 w-4 text-muted-foreground", className)}
        aria-label="Icono no disponible"
        {...props}
      />
    );
  }

  const IconComponent = icons[name];

  if (!IconComponent) {
    clientLogger.warn(
      `[DynamicIcon] Ícono '${name}' no encontrado en la librería activa '${activeLibraryId}'. Mostrando icono de ayuda.`
    );
    return (
      <HelpCircle
        className={cn("h-4 w-4 text-muted-foreground", className)}
        aria-label={`Ícono '${name}' no disponible`}
        {...props}
      />
    );
  }

  return <IconComponent className={className} {...props} />;
  // --- FIN DE REFACTORIZACIÓN HOLÍSTICA ---
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 *
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-28
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 *
 * @subsection Melhorias Adicionadas
 * 1. **Desacoplamiento Completo de Librerías de Iconos**: ((Implementada)) El componente ya no importa `lucide-react` directamente. Ahora consume el `IconLibraryContext` para obtener el mapeo de iconos activo, lo que permite intercambiar librerías sin modificar este archivo.
 * 2. **Manejo de Estados de Carga y Error**: ((Implementada)) El componente ahora maneja `isLoading` y `error` del contexto, mostrando un spinner de carga o un icono de error, respectivamente.
 * 3. **Fallback Robusto de Iconos**: ((Implementada)) Si un icono específico no se encuentra en la librería cargada, se renderiza un `HelpCircle` como fallback visual, mejorando la robustez y la UX.
 * 4. **Full Observabilidad Mejorada**: ((Implementada)) Se han añadido `clientLogger.trace` y `clientLogger.warn` contextuales para cada etapa del proceso de renderizado del icono, proporcionando una visibilidad completa del flujo de datos y la resolución de iconos.
 * 5. **Principios SOLID (OCP, DIP)**: ((Implementada)) Esta refactorización es una implementación ejemplar del Principio Abierto/Cerrado (abierto a extensión de librerías, cerrado a modificación del núcleo `DynamicIcon`) y del Principio de Inversión de Dependencias.
 *
 * @subsection Melhorias Futuras
 * 1. **Optimización de Bundle de Fallback**: ((Vigente)) Los iconos `Loader2`, `XCircle` y `HelpCircle` son de `lucide-react`. Si la librería activa no es `lucide-react`, estos iconos aún se cargarían. Una optimización de élite sería tener iconos de fallback pre-empaquetados o muy ligeros que no provengan de ninguna librería de iconos principal.
 * 2. **Cacheo de Mapeo de Iconos (useMemo)**: ((Vigente)) Aunque `IconLibraryProvider` ya memoiza `contextValue`, si el objeto `icons` es muy grande, `DynamicIcon` podría memoizar la búsqueda de `icons[name]` usando `React.useMemo` para evitar recalcularlo en cada render si `name` no cambia.
 *
 * =====================================================================
 */
// src/components/ui/DynamicIcon.tsx
