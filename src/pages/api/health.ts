// src/pages/api/health.ts

import { apiHandler } from "@/lib/api/api-handler";
import { HttpStatus } from "@/lib/errors";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @author RaZ Podestá - MetaShark Tech
 * @description Endpoint de Health Check para verificar la disponibilidad y el estado
 * operativo de la aplicación. Es un endpoint público y no autenticado.
 */

/**
 * @function getHealthStatus
 * @description Maneja las peticiones GET para el health check.
 * Devuelve un estado 'ok' junto con la fecha y hora actual en formato ISO.
 * @param {NextApiRequest} _req - El objeto de la solicitud (no utilizado).
 * @param {NextApiResponse} res - El objeto de la respuesta.
 */
const getHealthStatus = async (
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const healthData = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  res.status(HttpStatus.OK).json(healthData);
};

/**
 * @default
 * @description Exporta el manejador de la API route, configurado para
 * aceptar únicamente peticiones GET. Cualquier otro método será
 * automáticamente rechazado con un error 405 Method Not Allowed
 * por el apiHandler.
 */
export default apiHandler({
  GET: getHealthStatus,
});

// src/pages/api/health.ts
