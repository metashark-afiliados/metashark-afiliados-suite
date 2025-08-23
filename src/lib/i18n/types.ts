// src/lib/i18n/types.ts
/**
 * @file src/lib/i18n/types.ts
 * @description Aparato de Contratos de Datos para la Internacionalización.
 *              Este aparato deriva sus tipos de la Única Fuente de Verdad,
 *              el `i18nSchema` de Zod generado automáticamente, garantizando
 *              una sincronización perfecta entre el contrato de datos y los
 *              tipos utilizados en el código.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import { type Messages as GeneratedMessages } from "@/lib/validators/i18n.schema";

/**
 * @public
 * @typedef Messages
 * @description Representa la estructura completa y aplanada de todos los namespaces
 *              de mensajes de traducción. Este tipo es inferido directamente del
 *              `i18nSchema` generado, garantizando que el contrato de tipos
 *              esté siempre sincronizado con la SSoT.
 */
export type Messages = GeneratedMessages;

/**
 * @public
 * @typedef NestedKeyOf
 * @description Un tipo de utilidad avanzado de TypeScript que genera una unión de todas las
 *              rutas de claves anidadas de un objeto como cadenas de texto con
 *              notación de punto (ej. "userMenu_signOut").
 * @template T - El tipo del objeto a inspeccionar.
 */
export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends string
          ? `${K}`
          : `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : never;
    }[keyof T]
  : "";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Simplificación y Sincronización**: ((Implementada)) Se ha eliminado la inferencia compleja y ahora se consume directamente el tipo `Messages` generado, asegurando una alineación perfecta con la SSoT.
 *
 * @subsection Melhorias Futuras
 * 1. **Refinamiento de `NestedKeyOf`**: ((Vigente)) El tipo `NestedKeyOf` es potente pero complejo. Se podría investigar si las versiones más recientes de `next-intl` ofrecen una utilidad nativa para este propósito.
 *
 * =====================================================================
 */
// src/lib/i18n/types.ts
