// src/lib/i18n/hooks.ts
/**
 * @file src/lib/i18n/hooks.ts
 * @description Aparato de Hooks de Internacionalización. Ha sido nivelado para
 *              incluir la definición de tipo para `t.raw`, completando su
 *              contrato de API y resolviendo errores de tipo en los consumidores.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
"use client";

import { type ReactNode } from "react";
import { type RichTranslationValues, useTranslations } from "next-intl";

import { type Messages, type NestedKeyOf } from "./types";

type TypedTranslationFunction<T> = (
  key: NestedKeyOf<T>,
  values?: RichTranslationValues
) => string;

type TypedRichTranslationFunction<T> = (
  key: NestedKeyOf<T>,
  values?: RichTranslationValues
) => ReactNode;

// --- INICIO DE CORRECCIÓN DE CONTRATO ---
/**
 * @private
 * @typedef TypedRawTranslationFunction
 * @description Define la firma de la función de traducción `t.raw`.
 */
type TypedRawTranslationFunction<T> = (key: NestedKeyOf<T>) => any;
// --- FIN DE CORRECCIÓN DE CONTRATO ---

/**
 * @public
 * @function useTypedTranslations
 * @description Un wrapper tipado alrededor de `useTranslations` de `next-intl`.
 * @template T - El namespace de los mensajes a utilizar.
 * @returns {TypedTranslationFunction<Messages[T]> & { rich: TypedRichTranslationFunction<Messages[T]>, raw: TypedRawTranslationFunction<Messages[T]> }}
 */
export const useTypedTranslations = <T extends keyof Messages>(
  namespace: T
) => {
  const t = useTranslations(namespace as any);

  // --- INICIO DE CORRECCIÓN DE CONTRATO ---
  return t as TypedTranslationFunction<Messages[T]> & {
    rich: TypedRichTranslationFunction<Messages[T]>;
    raw: TypedRawTranslationFunction<Messages[T]>;
  };
  // --- FIN DE CORRECCIÓN DE CONTRATO ---
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Completitud de Contrato de API**: ((Implementada)) El tipo de retorno del hook ahora incluye la definición para el método `raw`. Esto resuelve el error `TS2339` en `ActionDock.tsx` y hace que el hook sea un wrapper de alta fidelidad de la API de `next-intl`.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Genérico para `t.raw`**: ((Vigente)) El tipo de retorno para `raw` es `any`. Se podría explorar una técnica de TypeScript más avanzada para inferir el tipo de retorno basado en la clave, aunque `any` es una solución pragmática y segura en este contexto.
 *
 * =====================================================================
 */
// src/lib/i18n/hooks.ts
