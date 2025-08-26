// next.config.mjs
/**
 * @file next.config.mjs
 * @description Manifiesto de configuración de Next.js. Corregido para alinear la
 *              estructura de la función `headers` con el contrato de la API de
 *              Next.js, resolviendo el error `Invalid header found`.
 * @author Raz Podestá - MetaShark Tech
 * @version 9.1.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import crypto from "crypto";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- INICIO DE CORRECCIÓN ARQUITECTÓNICA ---
  // La función async `headers` es la propiedad de nivel superior.
  async headers() {
    // Esta función se ejecuta para CADA petición en el servidor.
    const nonce = crypto.randomBytes(16).toString("base64");

    const cspDirectives = {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        process.env.NODE_ENV === "production"
          ? `'nonce-${nonce}'`
          : "'unsafe-eval'",
        "'unsafe-inline'",
      ],
      "worker-src": ["'self'", "blob:"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": [
        "'self'",
        "data:",
        "https://avatars.githubusercontent.com",
        "https://api.dicebear.com",
        "https://raw.githubusercontent.com",
        "https://images.unsplash.com",
      ],
      "font-src": ["'self'"],
      "connect-src": [
        "'self'",
        `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("://")[1]}`,
        `wss://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("://")[1]}`,
        "https://*.sentry.io",
        "http://ip-api.com",
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

    // La función devuelve un array de objetos de ruta.
    return [
      {
        source: "/:path*",
        // La propiedad `headers` aquí debe ser un ARRAY ESTÁTICO, no una función.
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s{2,}/g, " ").trim(),
          },
          { key: "x-nonce", value: nonce },
        ],
      },
    ];
  },
  // --- FIN DE CORRECCIÓN ARQUITECTÓNICA ---
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
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
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Resolución de Regresión Crítica:** Se ha reestructurado la función `headers` para que cumpla con el contrato de la API de Next.js, resolviendo el error `Invalid header found` y restaurando la funcionalidad del servidor.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **CSP Dinámica:** La configuración de la CSP podría ser externalizada a un archivo de manifiesto (`csp.config.js`) para una mayor separación de responsabilidades y mantenibilidad.
 *
 * =====================================================================
 */
// next.config.mjs
