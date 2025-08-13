// tailwind.config.mjs
/**
 * @file tailwind.config.mjs
 * @description Configuración canónica y de élite de Tailwind CSS. Ha sido
 *              nivelada para consumir la Única Fuente de Verdad desde
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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "hsl(var(--color-foreground) / 0.8)",
            "--tw-prose-headings": "hsl(var(--color-foreground))",
            "--tw-prose-lead": "hsl(var(--color-muted-foreground))",
            "--tw-prose-links": "hsl(var(--color-primary))",
            "--tw-prose-bold": "hsl(var(--color-foreground))",
            "--tw-prose-counters": "hsl(var(--color-muted-foreground))",
            "--tw-prose-bullets": "hsl(var(--color-border))",
            "--tw-prose-hr": "hsl(var(--color-border))",
            "--tw-prose-quotes": "hsl(var(--color-foreground))",
            "--tw-prose-quote-borders": "hsl(var(--color-border))",
            "--tw-prose-captions": "hsl(var(--color-muted-foreground))",
            "--tw-prose-code": "hsl(var(--color-foreground))",
            "--tw-prose-pre-code": "hsl(var(--color-foreground))",
            "--tw-prose-pre-bg": "hsl(var(--color-muted))",
            "--tw-prose-invert-body": "hsl(var(--color-foreground) / 0.7)",
            "--tw-prose-invert-headings": "hsl(var(--color-foreground))",
            "--tw-prose-invert-links": "hsl(var(--color-primary))",
            "--tw-prose-invert-bold": "hsl(var(--color-foreground))",
            "--tw-prose-invert-quotes": "hsl(var(--color-foreground))",
            "--tw-prose-invert-pre-bg": "hsl(var(--color-card))",
            p: { marginTop: "1.25em", marginBottom: "1.25em" },
            h2: {
              marginTop: "2em",
              marginBottom: "1em",
              fontWeight: "700",
            },
            h3: {
              marginTop: "1.6em",
              marginBottom: "0.6em",
              fontWeight: "600",
            },
          },
        },
      }),
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
 * 1. **Alineación Arquitectónica Definitiva**: ((Implementada)) Se ha refactorizado la sección `theme.extend.colors` para que consuma las variables CSS definidas en `globals.css`. Esta es la corrección final que resuelve el blocker de compilación.
 * 2. **Cero Regresiones de Plugins**: ((Implementada)) Se ha preservado intacta toda la configuración de `plugins` y la personalización de `typography` del archivo original, garantizando que no se pierda ninguna funcionalidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Plugin de Tema Programático**: ((Vigente)) Para una solución aún más DRY, la lógica de `generateTailwindColors` del snapshot primitivo podría adaptarse para crear un plugin de Tailwind que genere esta sección `colors` automáticamente a partir de un objeto de configuración.
 *
 * =====================================================================
 */
// tailwind.config.mjs
