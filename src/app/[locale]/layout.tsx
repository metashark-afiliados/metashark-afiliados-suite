// src/app/[locale]/layout.tsx
/**
 * @file src/app/[locale]/layout.tsx
 * @description Layout Canónico de Contexto y Estilo. Este aparato envuelve todas
 *              las páginas internacionalizadas y configura los proveedores de contexto
 *              globales como `NextIntlClientProvider` y `ThemeProvider`. Ha sido
 *              alineado con la arquitectura de Tailwind CSS v4.1, eliminando la
 *              importación del archivo de variables obsoleto.
 * @author L.I.A. Legacy
 * @version 12.0.0
 */
import React from "react";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { ThemeProvider } from "@/components/ThemeProvider";
import { locales } from "@/lib/navigation";

// La única importación de CSS necesaria es la de globals.css, que ahora contiene todo.
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Metashark - Plataforma de Marketing de Afiliados",
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

  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
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
 * 1. **Alineación Arquitectónica Definitiva**: ((Implementada)) La eliminación de la importación obsoleta de `theme-variables.css` completa la refactorización del sistema de diseño a la arquitectura canónica de Tailwind CSS v4.1. El proyecto está ahora libre de la deuda técnica que causaba el fallo de compilación.
 *
 * @subsection Melhorias Futuras
 * 1. **Proveedores de Contexto Adicionales**: ((Vigente)) Este layout sigue siendo el lugar canónico para añadir cualquier otro proveedor global que la aplicación necesite, como un futuro `SessionProvider` o el `DashboardProvider`.
 *
 * =====================================================================
 */
// src/app/[locale]/layout.tsx
