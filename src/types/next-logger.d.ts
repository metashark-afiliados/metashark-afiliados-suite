// src/types/next-logger.d.ts
/**
 * @file src/types/next-logger.d.ts
 * @description Archivo de definición de tipos (shim) para el módulo 'next-logger'.
 *              Este aparato enseña a TypeScript la forma del objeto `logger`
 *              exportado por la librería, resolviendo el error TS7016 y restaurando
 *              la seguridad de tipos en nuestra capa de logging.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
declare module "next-logger" {
  import { type PinoLogger } from "pino";

  // Define la forma del objeto logger exportado por el módulo
  export const logger: PinoLogger;

  // Si necesitáramos usar `withLogger` en otro lugar, también lo declararíamos aquí.
  // export function withLogger(config: any): (nextConfig: any) => any;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Seguridad de Tipos Restaurada**: ((Implementada)) La creación de este archivo "shim" resuelve el error `TS7016` y permite a nuestro `logger` consumir la librería `next-logger` de forma tipo-segura.
 * 2. **Documentación de Infraestructura**: ((Implementada)) Este archivo documenta explícitamente la forma del módulo externo, mejorando la mantenibilidad.
 *
 * @subsection Melhorias Futuras
 * 1. **Contribución Upstream**: ((Vigente)) La mejora de élite sería contribuir con esta definición de tipos al proyecto `next-logger` o a DefinitelyTyped para beneficiar a toda la comunidad.
 *
 * =====================================================================
 */
// src/types/next-logger.d.ts
