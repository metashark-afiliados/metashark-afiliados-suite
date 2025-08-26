// src/app/[locale]/layout.tsx
/**
 * @file src/app/[locale]/layout.tsx
 * @description Layout Canónico de Contexto y Estilo. Refactorizado para consumir
 *              el `nonce` de la cabecera de la petición y aplicarlo al `body`,
 *              completando el blindaje de seguridad contra ataques XSS.
 * @author Raz Podestá - MetaShark Tech
 * @version 13.0.0
 * @date 2025-08-26
 * @contact raz.metashark.tech
 * @location Florianópolis/SC, Brazil
 */
import React from "react";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { ThemeProvider } from "@/components/ThemeProvider";
import { locales } from "@/lib/navigation";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ConvertiKit - Plataforma de Marketing de Afiliados",
  description:
    "Crea, gestiona y optimiza tus campañas de marketing de afiliados en minutos.",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }
  unstable_setRequestLocale(locale);

  // --- INICIO DE REFACTORIZACIÓN DE SEGURIDAD (CSP) ---
  // Se lee el nonce generado por `next.config.js` en cada petición.
  const nonce = headers().get("x-nonce") || "";
  // --- FIN DE REFACTORIZACIÓN DE SEGURIDAD (CSP) ---

  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      {/* Se aplica el nonce al body. Next.js lo propagará a sus scripts. */}
      <body className="antialiased" nonce={nonce}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="bottom-right" />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. ((Implementada)) **Blindaje de Seguridad XSS Completado:** El layout ahora consume el `nonce` de la cabecera `x-nonce` y lo aplica al `<body>`. Next.js utilizará este `nonce` para autorizar la ejecución de sus propios scripts, completando así la implementación de la CSP estricta.
 * 2. ((Implementada)) **Arquitectura de Flujo de Datos Servidor:** La utilización de `headers()` de `next/headers` es la implementación canónica y de élite para acceder a las cabeceras de la petición dentro de un Server Component.
 *
 * @subsection Melhorias Futuras
 * 1. ((Vigente)) **Propagación de Nonce a Scripts de Terceros:** Si en el futuro se añaden scripts de terceros directamente en este layout (ej. Google Tag Manager), se deberá pasar explícitamente la prop `nonce={nonce}` a cada etiqueta `<Script>` de `next/script`.
 *
 * =====================================================================
 */
// src/app/[locale]/layout.tsx
