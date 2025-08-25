// next.config.mjs
/**
 * @file next.config.mjs
 * @description Manifiesto de configuración de Next.js. Ha sido refactorizado para
 *              incluir la directiva CSP `worker-src`, resolviendo un fallo crítico
 *              con la integración de Sentry Replay.
 * @author L.I.A. Legacy
 * @version 8.1.0
 */
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
  // --- INICIO DE CORRECCIÓN DE CSP ---
  "worker-src": ["'self'", "blob:"],
  // --- FIN DE CORRECCIÓN DE CSP ---
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "https://avatars.githubusercontent.com",
    "https://api.dicebear.com",
  ],
  "font-src": ["'self'"],
  "connect-src": [
    "'self'",
    `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("://")[1]}`,
    `wss://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("://")[1]}`,
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
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
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
 * 1. **Resolución de Fallo de Sentry Replay**: ((Implementada)) Se ha añadido la directiva `worker-src 'self' 'blob:'` a la CSP. Esto resuelve la causa raíz del error, permitiendo que la funcionalidad de Sentry Replay opere correctamente.
 * 2. **Blindaje de Seguridad**: ((Implementada)) La política ahora es más explícita y segura. También se han añadido `wss://...` a `connect-src` y `api.dicebear.com` a `img-src` para prevenir futuros errores de CSP.
 *
 * @subsection Melhorias Futuras
 * 1. **Gestión Dinámica de CSP**: ((Vigente)) Mover la generación de las cabeceras CSP al middleware para una gestión más centralizada y flexible, especialmente si se necesitan directivas diferentes para rutas específicas.
 *
 * =====================================================================
 */
// next.config.mjs
