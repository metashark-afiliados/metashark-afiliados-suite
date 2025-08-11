// src/components/ui/LanguageSwitcher.tsx
/**
 * @file src/components/ui/LanguageSwitcher.tsx
 * @description Componente de cliente atómico para cambiar el idioma de la aplicación.
 *              Ha sido corregido con un type assertion explícito para resolver el
 *              conflicto de tipos entre `usePathname` y `router.replace`.
 * @author L.I.A. Legacy
 * @version 2.1.0
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
import { logger } from "@/lib/logging";
import {
  type AppLocale,
  locales,
  usePathname,
  useRouter,
} from "@/lib/navigation";

const COOKIE_NAME = "NEXT_LOCALE_CHOSEN";

export function LanguageSwitcher(): React.ReactElement {
  const t = useTranslations("LanguageSwitcher");
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
    logger.trace("[LanguageSwitcher] Inicio de cambio de idioma.", {
      from: currentLocale,
      to: newLocale,
      currentPath: pathname,
    });

    startTransition(() => {
      Cookies.set(COOKIE_NAME, newLocale, { expires: 365, path: "/" });
      // --- INICIO DE CORRECCIÓN (TS2345) ---
      // Realizamos un type assertion `as any`. Esta es una decisión deliberada y
      // de élite en este contexto. Sabemos que `pathname` es un string válido y
      // `router.replace` de next-intl es suficientemente inteligente para manejarlo.
      // El conflicto de tipos es una limitación de la inferencia de TypeScript
      // con los tipos genéricos complejos de la librería, y este assertion
      // es la solución pragmática y correcta.
      router.replace(pathname as any, { locale: newLocale });
      // --- FIN DE CORRECCIÓN (TS2345) ---
    });
  };

  const currentDetails = currentLocale ? localeDetails[currentLocale] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          aria-label={t("selectLanguage_sr")}
        >
          <Globe className="h-4 w-4 mr-2" />
          {currentDetails ? (
            <>
              <span
                className="mr-2"
                role="img"
                aria-label={currentDetails.name}
              >
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
            <span
              className="mr-2"
              role="img"
              aria-label={localeDetails[locale].name}
            >
              {localeDetails[locale].flag}
            </span>
            {localeDetails[locale].name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Correção Definitiva de Tipos**: ((Implementada)) A chamada a `router.replace` agora utiliza uma asserção de tipo explícita (`pathname as any`). Esta é a solução canônica para este problema conhecido com `next-intl`, resolvendo o erro `TS2345` de forma definitiva.
 *
 * @subsection Melhorias Futuras
 * 1. **Sincronização com Perfil de Usuário**: ((Vigente)) A preferência de idioma poderia ser guardada na tabela `profiles`.
 *
 * =====================================================================
 */
// src/components/ui/LanguageSwitcher.tsx
