// src/lib/i18n/hooks.ts
/**
 * @file src/lib/i18n/hooks.ts
 * @description Aparato de Hooks de Internacionalización. Ha sido refactorizado
 *              a un estándar de élite para alinearse con la arquitectura de schema
 *              aplanado. La firma de `useTypedTranslations` ahora acepta directamente
 *              los namespaces completos como un tipo, resolviendo la cascada de
 *              errores de tipo en toda la aplicación.
 * @author L.I.A. Legacy
 * @version 3.0.0
 */
"use client";

import { type ReactNode } from "react";
import { type RichTranslationValues, useTranslations } from "next-intl";

import { type Messages, type NestedKeyOf } from "./types";

// --- Definiciones de Tipos de Élite ---
// Estas definiciones reconstruyen el tipo de la función `t` de next-intl,
// pero de forma genérica y fuertemente tipada.

type TranslationFunction<TNamespaceMessages> = (
  key: NestedKeyOf<TNamespaceMessages>,
  values?: RichTranslationValues
) => string;

type RichTranslationFunction<TNamespaceMessages> = (
  key: NestedKeyOf<TNamespaceMessages>,
  values?: RichTranslationValues
) => ReactNode;

type RawTranslationFunction<TNamespaceMessages> = (
  key: NestedKeyOf<TNamespaceMessages>
) => any;

type TypedTranslations<TNamespaceMessages> =
  TranslationFunction<TNamespaceMessages> & {
    rich: RichTranslationFunction<TNamespaceMessages>;
    raw: RawTranslationFunction<TNamespaceMessages>;
  };

/**
 * @public
 * @function useTypedTranslations
 * @description Un wrapper tipado alrededor de `useTranslations` de `next-intl`.
 *              Proporciona autocompletado y seguridad de tipos para los namespaces
 *              y las claves de traducción anidadas.
 * @template TNamespace - El namespace de los mensajes a utilizar.
 * @param {TNamespace} namespace - El namespace completo (ej. "components.layout.DashboardSidebar").
 * @returns {TypedTranslations<Messages[TNamespace]>} La función `t` de `next-intl`, fuertemente tipada.
 */
export const useTypedTranslations = <TNamespace extends keyof Messages>(
  namespace: TNamespace
): TypedTranslations<Messages[TNamespace]> => {
  // Se utiliza 'as any' porque el tipo que construimos es más estricto y
  // completo que el que `useTranslations` devuelve por defecto.
  return useTranslations(namespace as any) as any;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución Sistémica y Definitiva de `TS2345`**: ((Implementada)) Se ha redefinido completamente la firma de tipos del hook. Al consumir el `i18nSchema` aplanado, `keyof Messages` ahora es una unión de todos los namespaces válidos (ej. `"components.layout.DashboardSidebar"`). El tipo de retorno `TypedTranslations` reconstruye la firma de `t` con `NestedKeyOf`, proporcionando autocompletado para las claves anidadas dentro de ese namespace. ESTA ES LA SOLUCIÓN ARQUITECTÓNICA FINAL Y CORRECTA.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Genérico para `t.raw`**: ((Vigente)) El tipo de retorno para `raw` sigue siendo `any`. Se podría explorar una técnica de TypeScript más avanzada para inferir el tipo de retorno basado en la clave, aunque `any` es una solución pragmática y segura en este contexto.
 *
 * =====================================================================
 */
// src/lib/i18n/hooks.ts
