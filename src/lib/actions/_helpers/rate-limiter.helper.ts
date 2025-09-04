// src/lib/actions/_helpers/rate-limiter.helper.ts
/**
 * @file src/lib/actions/_helpers/rate-limiter.helper.ts
 * @description Aparato de ayuda de seguridad para la limitación de tasa (rate limiting).
 *              Esta es la SSoT para proteger endpoints contra abuso, utilizando
 *              un almacenamiento de clave-valor distribuido (Vercel KV).
 * @author L.I.A. Legacy
 * @version 3.0.0
 * @see .docs-espejo/lib/actions/_helpers/rate-limiter.helper.ts.md
 */
"use server";
import "server-only";

import { kv } from "@vercel/kv";

import { logger } from "@/lib/logger";
import { type ActionResult, type ValidationErrorKey } from "@/lib/validators";

const RATE_LIMIT_LIMIT = parseInt(process.env.RATE_LIMIT_LIMIT || "10", 10);
const RATE_LIMIT_DURATION_S = parseInt(
  process.env.RATE_LIMIT_DURATION_S || "60",
  10
);

/**
 * @public
 * @typedef RateLimitedAction
 * @description Define los tipos de acciones que están sujetas a limitación de tasa.
 *              Esta lista debe ser extendida a medida que se protegen nuevas acciones.
 */
export type RateLimitedAction = "password_reset" | "login" | "email_resend";

/**
 * @public
 * @async
 * @function checkRateLimit
 * @description Verifica si una acción puede ser ejecutada basándose en los límites
 *              de tasa definidos. Es un guardián de seguridad preventivo.
 * @param {string | null | undefined} ip - La dirección IP de la petición.
 * @param {RateLimitedAction} action - El tipo de acción a limitar.
 * @returns {Promise<ActionResult<void>>} El resultado de la verificación. Si tiene éxito,
 *          la acción puede proceder. Si falla, la Server Action debe retornar
 *          el objeto de error.
 */
export async function checkRateLimit(
  ip: string | null | undefined,
  action: RateLimitedAction
): Promise<ActionResult<void>> {
  if (!ip) {
    logger.warn(
      { action },
      "[RateLimiter] No se pudo determinar la dirección IP. Se omitirá la verificación."
    );
    return { success: true, data: undefined };
  }

  const key = `rate_limit:${action}:${ip}`;
  const context = { ip, action, key };

  try {
    const currentCount = await kv.get<number>(key);

    if (currentCount && currentCount >= RATE_LIMIT_LIMIT) {
      logger.warn(
        { ...context, limit: RATE_LIMIT_LIMIT, count: currentCount },
        "[RateLimiter] Límite de tasa excedido."
      );
      return {
        success: false,
        error: "generic.error_too_many_requests" as ValidationErrorKey,
      };
    }

    const pipe = kv.pipeline();
    pipe.incr(key);
    pipe.expire(key, RATE_LIMIT_DURATION_S);
    await pipe.exec();

    logger.trace(
      { ...context, count: (currentCount || 0) + 1 },
      "[RateLimiter] Petición permitida y contada."
    );

    return { success: true, data: undefined };
  } catch (error) {
    logger.error(
      { err: error, ...context },
      "[RateLimiter] Fallo crítico al interactuar con Vercel KV. Se permitirá la acción por defecto (fail open)."
    );
    // Fail open for resilience: si el rate limiter falla, no bloqueamos al usuario.
    return { success: true, data: undefined };
  }
}
// src/lib/actions/_helpers/rate-limiter.helper.ts
