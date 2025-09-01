// src/lib/actions/_helpers/rate-limiter.helper.ts
/**
 * @file src/lib/actions/_helpers/rate-limiter.helper.ts
 * @description Helper de seguridad para la limitación de tasa (rate limiting).
 *              Alineado con la arquitectura de logging de élite (pino).
 * @author @author RaZ Podestá - MetaShark Tech
 * @version 2.1.0
 * @see .docs-espejo/lib/actions/_helpers/rate-limiter.helper.ts.md
 */
"use server";
import "server-only";

import { kv } from "@vercel/kv";

import { logger } from "@/lib/logger";
import { type ActionResult } from "@/lib/validators";

const RATE_LIMIT_LIMIT = parseInt(process.env.RATE_LIMIT_LIMIT || "10", 10);
const RATE_LIMIT_DURATION_S = parseInt(
  process.env.RATE_LIMIT_DURATION_S || "60",
  60
);

export type RateLimitedAction = "password_reset" | "login" | "email_resend";

/**
 * @public
 * @async
 * @function checkRateLimit
 * @description Verifica si una acción puede ser ejecutada basándose en límites de tasa.
 * @param {string | null | undefined} ip - La dirección IP de la petición.
 * @param {RateLimitedAction} action - El tipo de acción a limitar.
 * @returns {Promise<ActionResult<void>>} El resultado de la verificación.
 */
export async function checkRateLimit(
  ip: string | null | undefined,
  action: RateLimitedAction
): Promise<ActionResult<void>> {
  if (!ip) {
    logger.warn(
      `[RateLimiter] No se pudo determinar la dirección IP. Se omitirá la verificación.`,
      { action }
    );
    return { success: true, data: undefined };
  }

  const key = `rate_limit:${action}:${ip}`;

  try {
    const currentCount = await kv.get<number>(key);

    if (currentCount && currentCount >= RATE_LIMIT_LIMIT) {
      logger.warn(`[RateLimiter] Límite de tasa excedido.`, {
        ip,
        action,
        limit: RATE_LIMIT_LIMIT,
      });
      return {
        success: false,
        error: "ValidationErrors.generic.error_too_many_requests",
      };
    }

    const pipe = kv.pipeline();
    pipe.incr(key);
    pipe.expire(key, RATE_LIMIT_DURATION_S);
    await pipe.exec();

    logger.trace(`[RateLimiter] Petición permitida y contada.`, {
      ip,
      action,
      count: (currentCount || 0) + 1,
    });

    return { success: true, data: undefined };
  } catch (error) {
    logger.error(
      `[RateLimiter] Fallo crítico al interactuar con Vercel KV. Se permitirá la acción por defecto.`,
      { err: error, key }
    );
    return { success: true, data: undefined };
  }
}
// src/lib/actions/_helpers/rate-limiter.helper.ts
