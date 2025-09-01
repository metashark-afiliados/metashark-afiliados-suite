// src/lib/api/api-handler.ts

import { NextApiRequest, NextApiResponse } from "next";
import { AppError, handleError, HttpStatus } from "@/lib/errors";
import { AppErrorCode } from "../errors";

/**
 * @author RaZ Podestá - MetaShark Tech
 * @description Define un manejador de API de orden superior (HOF) para estandarizar
 * el procesamiento de las API Routes en Next.js.
 */

/**
 * @type ApiMethodHandler
 * @description Define la firma de una función de manejo para un método HTTP específico.
 * @param {NextApiRequest} req - El objeto de la solicitud de Next.js.
 * @param {NextApiResponse} res - El objeto de la respuesta de Next.js.
 */
type ApiMethodHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

/**
 * @interface ApiHandlers
 * @description Define un objeto que mapea métodos HTTP a sus correspondientes funciones de manejo.
 */
interface ApiHandlers {
  [method: string]: ApiMethodHandler;
}

/**
 * @function apiHandler
 * @description Factoría que crea un manejador de API Route de Next.js.
 * Abstrae la lógica común de validación de método HTTP y el manejo de errores.
 *
 * @param {ApiHandlers} handlers - Un objeto donde cada clave es un método HTTP
 * (ej. 'GET', 'POST') y el valor es la función que maneja ese método.
 *
 * @returns {NextApiHandler} Un manejador de API Route de Next.js listo para ser exportado.
 *
 * @example
 * // En src/pages/api/some-route.ts
 * import { apiHandler } from '@/lib/api/api-handler';
 *
 * export default apiHandler({
 *   GET: async (req, res) => {
 *     res.status(200).json({ message: 'Success!' });
 *   },
 *   POST: async (req, res) => {
 *     const data = req.body;
 *     // ... procesar data ...
 *     res.status(201).json({ created: true });
 *   }
 * });
 */
export function apiHandler(handlers: ApiHandlers) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      const method = req.method?.toUpperCase();
      if (!method) {
        throw new AppError(
          "No se especificó un método HTTP.",
          HttpStatus.METHOD_NOT_ALLOWED,
          AppErrorCode.VALIDATION_ERROR
        );
      }

      const handlerForMethod = handlers[method];

      if (!handlerForMethod) {
        res.setHeader("Allow", Object.keys(handlers).join(", "));
        throw new AppError(
          `Método ${method} no permitido para este endpoint.`,
          HttpStatus.METHOD_NOT_ALLOWED,
          AppErrorCode.VALIDATION_ERROR,
          { allowedMethods: Object.keys(handlers) }
        );
      }

      await handlerForMethod(req, res);
    } catch (error) {
      // La función handleError ya se encarga de loggear el error y enviar
      // una respuesta HTTP estandarizada.
      handleError(error, res);
    }
  };
}

// src/lib/api/api-handler.ts
