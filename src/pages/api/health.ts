// src/pages/api/health.ts
/**
 * @file health.ts
 * @description Endpoint de Health Check. Refactorizado para ser autónomo,
 *              eliminando la dependencia del obsoleto `api-handler` y utilizando
 *              la API nativa de Next.js y el `logger` canónico.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 */
import { type NextApiRequest, type NextApiResponse } from "next";
import { logger } from "@/lib/logger";

/**
 * @public
 * @async
 * @function handler
 * @description Maneja las peticiones a la API de health check.
 * @param {NextApiRequest} req - El objeto de la solicitud.
 * @param {NextApiResponse} res - El objeto de la respuesta.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
    return res.status(200).json(healthData);
  } catch (error) {
    logger.error(
      { err: error },
      "[API:Health] Fallo inesperado en el health check."
    );
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
}
// src/pages/api/health.ts
