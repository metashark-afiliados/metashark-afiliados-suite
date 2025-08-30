
// src/app/[locale]/layout.tsx
/**
 * @file src/app/[locale]/layout.tsx
 * @description Layout Raíz Canónico de Contexto y Estilo. Refactorizado para
 *              incluir documentación de élite sobre la implementación de seguridad CSP
 *              y para consumir el `IconLibraryProvider` a nivel global.
 * @author Raz Podestá - MetaShark Tech
 * @version 15.0.0
 * @date 2025-08-30
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
import { IconLibraryProvider } from "@/lib/context/IconLibraryContext";
import { locales } from "@/lib/navigation";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ConvertiKit - Plataforma de Marketing de Afiliados",
  description:
    "Crea, gestiona y optimiza tus campañas de marketing de afiliados en minutos.",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

/**
 * @public
 * @function generateStaticParams
 * @description Genera las rutas estáticas para cada `locale` soportado,
 *              optimizando el rendimiento de la construcción (build).
 * @returns Un array de objetos con los parámetros de `locale`.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * @public
 * @component LocaleLayout
 * @description El layout raíz que envuelve cada página de la aplicación.
 * @param {object} props
 * @param {React.ReactNode} props.children - El Server Component de la página actual.
 * @param {object} props.params - Los parámetros de la ruta, incluyendo el `locale`.
 * @returns {React.ReactElement} El elemento `<html>` completo con todos los proveedores de contexto.
 */
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

  // Implementación de seguridad CSP: Se lee el nonce generado en `next.config.mjs`
  // para esta petición específica desde las cabeceras.
  const nonce = headers().get("x-nonce") || "";

  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      {/* El nonce se aplica al body. Next.js lo propagará automáticamente a
          sus scripts inline, cumpliendo con la Política de Seguridad de Contenido. */}
      <body className="antialiased" nonce={nonce}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <IconLibraryProvider activeLibraryId="lucide">
              <Toaster position="bottom-right" />
              {children}
            </IconLibraryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
// src/app/[locale]/layout.tsx