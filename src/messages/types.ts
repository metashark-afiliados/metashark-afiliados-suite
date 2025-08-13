// src/messages/types.ts
/**
 * @file src/messages/types.ts
 * @description Contrato de datos para la arquitectura de mensajes atómicos.
 *              Esta es la Única Fuente de Verdad para la estructura de CUALQUIER
 *              archivo de mensajes .json en el directorio `src/messages`.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { type AppLocale } from "@/lib/navigation";

/**
 * @public
 * @type MessageModule
 * @description Define la estructura que debe tener cada archivo .json de mensajes.
 *              Es un registro donde cada clave es un `AppLocale` soportado, y el valor
 *              es un objeto anidado de strings.
 */
export type MessageModule = {
  [key in AppLocale]: Record<string, any>;
};

/**
 * @public
 * @type ManifestModule
 * @description Define la firma de una función dentro del `messagesManifest`.
 *              Es una función asíncrona que no toma argumentos y devuelve una
 *              promesa que resuelve a un objeto con una exportación `default`
 *              del tipo `MessageModule`.
 */
export type ManifestModule = () => Promise<{
  default: MessageModule;
}>;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fundación de Seguridad de Tipos**: ((Implementada)) Este aparato establece el contrato de datos para todo el sistema IMAS.
 *
 * =====================================================================
 */
// src/messages/types.ts
