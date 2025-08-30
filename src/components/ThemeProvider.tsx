// src/components/ThemeProvider.tsx
/**
 * @file src/components/ThemeProvider.tsx
 * @description Proveedor de contexto para la gestión de temas (claro/oscuro).
 *              Este componente encapsula `next-themes` para proporcionar la funcionalidad
 *              de cambio de tema a toda la aplicación. Se ha corregido la importación
 *              de tipos para alinearla con las versiones modernas de la librería.
 * @author L.I.A. Legacy
 * @version 2.1.0 (Protocol Aligned)
 */
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/**
 * @public
 * @component ThemeProvider
 * @description Componente de cliente que envuelve la aplicación para proporcionar
 *              funcionalidad de cambio de tema (claro/oscuro). Es un wrapper
 *              directo sobre el `ThemeProvider` de `next-themes`.
 * @param {ThemeProviderProps} props - Propiedades para configurar el proveedor de temas,
 *        heredadas directamente de `next-themes`.
 * @returns {React.ReactElement}
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
// src/components/ThemeProvider.tsx
