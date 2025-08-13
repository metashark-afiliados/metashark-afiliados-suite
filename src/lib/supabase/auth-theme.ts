// src/lib/supabase/auth-theme.ts
/**
 * @file src/lib/supabase/auth-theme.ts
 * @description Manifiesto de Estilo para la UI de Supabase. Ha sido revertido a
 *              su estado canónico y simple. Su única responsabilidad es exportar
 *              un objeto estático `brandTheme` que define la apariencia visual,
 *              sin incluir lógica de localización.
 * @author Raz Podestá
 * @version 3.1.0
 */
import { type Theme } from "@supabase/auth-ui-shared";

/**
 * @public
 * @constant brandTheme
 * @description El objeto de tema estático para la UI de Supabase. Se inyecta en la
 *              prop `appearance` del componente `<Auth>`.
 */
export const brandTheme: Theme = {
  default: {
    colors: {
      brand: "hsl(var(--primary))",
      brandAccent: "hsl(var(--primary) / 0.8)",
      brandButtonText: "hsl(var(--primary-foreground))",
      defaultButtonBackground: "hsl(var(--card))",
      defaultButtonBackgroundHover: "hsl(var(--muted))",
      defaultButtonBorder: "hsl(var(--border))",
      defaultButtonText: "hsl(var(--foreground))",
      dividerBackground: "hsl(var(--border))",
      inputBackground: "hsl(var(--input))",
      inputBorder: "hsl(var(--border))",
      inputBorderHover: "hsl(var(--ring))",
      inputBorderFocus: "hsl(var(--ring))",
      inputText: "hsl(var(--foreground))",
      inputLabelText: "hsl(var(--muted-foreground))",
      inputPlaceholder: "hsl(var(--muted-foreground) / 0.6)",
      messageText: "hsl(var(--foreground))",
      messageTextDanger: "hsl(var(--destructive))",
      anchorTextColor: "hsl(var(--muted-foreground))",
      anchorTextHoverColor: "hsl(var(--primary))",
    },
    space: {
      spaceSmall: "4px",
      spaceMedium: "8px",
      spaceLarge: "16px",
      labelBottomMargin: "8px",
      anchorBottomMargin: "4px",
      emailInputSpacing: "8px",
      socialAuthSpacing: "8px",
      buttonPadding: "10px 15px",
      inputPadding: "10px 15px",
    },
    fontSizes: {
      baseBodySize: "14px",
      baseInputSize: "14px",
      baseLabelSize: "14px",
      baseButtonSize: "14px",
    },
    fonts: {
      bodyFontFamily: `var(--font-geist-sans), sans-serif`,
      buttonFontFamily: `var(--font-geist-sans), sans-serif`,
      inputFontFamily: `var(--font-geist-sans), sans-serif`,
      labelFontFamily: `var(--font-geist-sans), sans-serif`,
    },
    radii: {
      borderRadiusButton: "var(--radius)",
      buttonBorderRadius: "var(--radius)",
      inputBorderRadius: "var(--radius)",
    },
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simplificación Arquitectónica**: ((Implementada)) Al eliminar la factoría, este aparato vuelve a ser un manifiesto de configuración puro, más simple y mantenible.
 *
 * =====================================================================
 */
// src/lib/supabase/auth-theme.ts
