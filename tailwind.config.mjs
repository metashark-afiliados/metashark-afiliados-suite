// tailwind.config.mjs
/**
 * @file tailwind.config.mjs
 * @description Configuración canónica y de élite de Tailwind CSS. Ha sido
 *              nivelado para consumir la Única Fuente de Verdad desde
 *              `src/app/globals.css`, alineándose con la arquitectura de
 *              Tailwind CSS v4.1 y garantizando una consistencia de diseño
 *              absoluta.
 * @author Raz Podestá
 * @version 8.0.0
 */
import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import scrollbarHide from "tailwind-scrollbar-hide";
import tailwindcssAnimate from "tailwindcss-animate";
import debugScreens from "tailwindcss-debug-screens";
import radixPlugin from "tailwindcss-radix";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--color-border) / <alpha-value>)",
        input: "hsl(var(--color-input) / <alpha-value>)",
        ring: "hsl(var(--color-ring) / <alpha-value>)",
        background: "hsl(var(--color-background) / <alpha-value>)",
        foreground: "hsl(var(--color-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
          foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-secondary) / <alpha-value>)",
          foreground: "hsl(var(--color-secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--color-destructive) / <alpha-value>)",
          foreground:
            "hsl(var(--color-destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--color-muted) / <alpha-value>)",
          foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent) / <alpha-value>)",
          foreground: "hsl(var(--color-accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--color-popover) / <alpha-value>)",
          foreground: "hsl(var(--color-popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--color-card) / <alpha-value>)",
          foreground: "hsl(var(--color-card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    typography,
    forms,
    aspectRatio,
    containerQueries,
    radixPlugin,
    scrollbarHide,
    process.env.NODE_ENV === "development" ? debugScreens : {},
  ],
};

export default config;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alineación Arquitectónica Definitiva**: ((Implementada)) Se ha refactorizado la sección `theme.extend.colors` para que consuma las variables CSS definidas en `globals.css`. Esta es la corrección fundamental que resuelve el blocker de compilación.
 * 2. **Cero Regresiones de Plugins**: ((Implementada)) Se ha preservado intacta toda la configuración de `plugins` del archivo original.
 *
 * @subsection Melhorias Futuras
 * 1. **Plugin de Tema Programático**: ((Vigente)) La lógica para generar esta sección `colors` podría ser abstraída a un plugin local de Tailwind para un enfoque aún más DRY.
 *
 * =====================================================================
 */
// tailwind.config.mjs
