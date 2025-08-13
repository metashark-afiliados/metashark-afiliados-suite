// next.config.mjs
/**
 * @file next.config.mjs
 * @description Manifiesto de configuración de Next.js. Este aparato es la Única
 *              Fuente de Verdad para la configuración del framework. Se ha corregido
 *              un error de sintaxis crítico (coma faltante) que impedía la compilación.
 * @author L.I.A. Legacy
 * @version 8.0.1
 */
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https://avatars.githubusercontent.com"],
  "font-src": ["'self'"],
  "connect-src": [
    "'self'",
    `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("://")[1]}`,
    "https://*.sentry.io",
  ],
  "frame-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
};

const cspHeader = Object.entries(cspDirectives)
  .map(([key, value]) => `${key} ${value.join(" ")}`)
  .join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
  // <-- Coma agregada aquí para cumplir con la sintaxis del objeto
};

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
};

const finalConfig = withSentryConfig(
  withNextIntl(nextConfig),
  sentryWebpackPluginOptions,
  {
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);

export default finalConfig;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Gestión Dinámica de CSP**: ((Vigente)) Mover la generación de las cabeceras CSP al middleware para una gestión más centralizada y flexible.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Corrección de Sintaxis (TS1005)**: ((Implementada)) Se ha añadido la coma faltante en el objeto `nextConfig`, resolviendo el error de compilación.
 * 2. **Configuración de Sentry Mantenida**: ((Implementada)) La integración con Sentry y `next-intl` se ha mantenido y encadenado correctamente.
 *
 * =====================================================================
 */
// next.config.mjs
