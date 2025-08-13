// src/components/ThemeProvider.tsx
/**
 * @file src/components/ThemeProvider.tsx
 * @description Proveedor de contexto para la gestión de temas (claro/oscuro).
 *              Este componente encapsula `next-themes` para proporcionar la funcionalidad
 *              de cambio de tema a toda la aplicación. Se ha corregido la importación
 *              de tipos para alinearla con las versiones modernas de la librería.
 * @author L.I.A. Legacy
 * @version 2.0.0 (Corrected Type Import)
 */
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
// CORRECCIÓN: Con la librería actualizada, los tipos se exportan desde el
// punto de entrada principal, no desde una ruta interna 'dist/types'.
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Hook de Tema Personalizado (`useBrandTheme`)**: ((Vigente)) Abstraer el uso del hook `useTheme` en un hook personalizado (`useBrandTheme`) para centralizar la lógica de negocio futura (ej. analíticas en cambio de tema) sin refactorizar componentes consumidores.
 * 2. **Persistencia en Base de Datos**: ((Vigente)) Para usuarios autenticados, la preferencia de tema podría guardarse en la tabla `profiles` de Supabase. El `ThemeProvider` podría leer esta preferencia al cargar la sesión, sincronizando la experiencia a través de diferentes dispositivos.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Contrato de Tipos**: ((Implementada)) Se ha corregido la ruta de importación de `ThemeProviderProps` para que apunte al módulo raíz de `next-themes`. Esto resuelve el error de compilación `TS2305` y alinea el aparato con las prácticas actuales de la librería.
 * 2. **Restauración de Funcionalidad de Tema**: ((Implementada)) La reconstrucción de este componente es el último paso necesario para que el `LocaleLayout` sea completamente funcional, restaurando la capacidad de cambiar entre temas claro y oscuro.
 *
 * =====================================================================
 */
// src/components/ThemeProvider.tsx
