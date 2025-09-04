// src/components/ui/LanguageSwitcher.tsx
/**
 * @file src/components/ui/LanguageSwitcher.tsx
 * @description Componente de cliente atómico para cambiar el idioma.
 *              Refactorizado para utilizar la firma correcta del `clientLogger`,
 *              resolviendo el error de tipo TS2345.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import Cookies from "js-cookie";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientLogger } from "@/lib/logger";
import {
  type AppLocale,
  locales,
  usePathname,
  useRouter,
} from "@/lib/navigation";

const COOKIE_NAME = "NEXT_LOCALE"; // Corregido según el estándar de next-intl

export function LanguageSwitcher(): React.ReactElement {
  const t = useTranslations("components.ui.LanguageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale = params.locale as AppLocale;

  const localeDetails: Record<AppLocale, { name: string; flag: string }> = {
    "en-US": { name: t("language_en_US"), flag: t("flag_en_US") },
    "es-ES": { name: t("language_es_ES"), flag: t("flag_es_ES") },
    "pt-BR": { name: t("language_pt_BR"), flag: t("flag_pt_BR") },
  };

  const handleLocaleChange = (newLocale: AppLocale): void => {
    clientLogger.trace(
      "[LanguageSwitcher] Inicio de cambio de idioma.", // Mensaje
      { from: currentLocale, to: newLocale } // Contexto como argumento separado
    );
    startTransition(() => {
      Cookies.set(COOKIE_NAME, newLocale, { expires: 365, path: "/" });
      router.replace(pathname as any, { locale: newLocale });
    });
  };

  const currentDetails = currentLocale ? localeDetails[currentLocale] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          <Globe className="h-4 w-4 mr-2" />
          {currentDetails ? (
            <>
              <span className="mr-2" role="img" aria-hidden>
                {currentDetails.flag}
              </span>
              <span className="hidden sm:inline">{currentDetails.name}</span>
            </>
          ) : (
            "..."
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale: AppLocale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => handleLocaleChange(locale)}
            disabled={locale === currentLocale || isPending}
          >
            <span className="mr-2" role="img" aria-hidden>
              {localeDetails[locale].flag}
            </span>
            {localeDetails[locale].name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// src/components/ui/LanguageSwitcher.tsx
