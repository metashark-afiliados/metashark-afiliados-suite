// src/lib/errors.ts

import logger from "@/lib/logger";
import { NextApiResponse } from "next";

/**
 * @author RaZ Podestá - MetaShark Tech
 * @description Módulo centralizado para la gestión de errores de la aplicación.
 * Define una clase base 'AppError' que integra automáticamente el logging
 * al momento de su instanciación, y clases específicas para errores comunes.
 */

/**
 * @enum {number}
 * @description Enum para códigos de estado HTTP estándar.
 * Facilita la consistencia y legibilidad al asignar códigos de estado.
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * @enum {string}
 * @description Códigos de error específicos de la aplicación.
 * Permite identificar y agrupar errores de forma programática para
 * monitoreo, alertas o lógica de negocio específica.
 */
export enum AppErrorCode {
  // General
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",

  // Auth
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

  // Resource
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  DATABASE_ERROR = "DATABASE_ERROR",
  DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE",

  // API
  EXTERNAL_API_FAILURE = "EXTERNAL_API_FAILURE",
}

/**
 * @interface IAppErrorContext
 * @description Define la estructura para el contexto adicional que puede ser
 * adjuntado a un AppError para un logging más enriquecido.
 */
export interface IAppErrorContext {
  [key: string]: unknown;
}

/**
 * @class AppError
 * @extends Error
 * @description Clase base para todos los errores personalizados de la aplicación.
 * Al ser instanciada, automáticamente registra el error usando el logger centralizado.
 */
export class AppError extends Error {
  public readonly statusCode: HttpStatus;
  public readonly errorCode: AppErrorCode;
  public readonly context?: IAppErrorContext;

  /**
   * Crea una instancia de AppError.
   * @param {string} message - Mensaje de error legible para desarrolladores (no para el usuario final).
   * @param {HttpStatus} statusCode - Código de estado HTTP asociado al error.
   * @param {AppErrorCode} errorCode - Código de error interno de la aplicación.
   * @param {IAppErrorContext} [context] - Datos contextuales adicionales para el logging.
   */
  constructor(
    message: string,
    statusCode: HttpStatus,
    errorCode: AppErrorCode,
    context?: IAppErrorContext
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.context = context;

    // Garantiza que cada error sea un evento observable.
    logger.error(
      {
        err: this, // El objeto error en sí mismo, para stack trace
        statusCode: this.statusCode,
        errorCode: this.errorCode,
        context: this.context,
      },
      this.message
    );

    // Mantiene un stack trace limpio, excluyendo el constructor de AppError.
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- Clases de Error Específicas ---

/**
 * @class NotFoundError
 * @extends AppError
 * @description Error para indicar que un recurso solicitado no fue encontrado.
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Recurso", context?: IAppErrorContext) {
    super(
      `${resource} no encontrado.`,
      HttpStatus.NOT_FOUND,
      AppErrorCode.RESOURCE_NOT_FOUND,
      context
    );
  }
}

/**
 * @class ValidationError
 * @extends AppError
 * @description Error para fallos de validación de datos de entrada.
 */
export class ValidationError extends AppError {
  constructor(
    message: string = "La validación falló.",
    context?: IAppErrorContext
  ) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      AppErrorCode.VALIDATION_ERROR,
      context
    );
  }
}

/**
 * @class UnauthorizedError
 * @extends AppError
 * @description Error para intentos de acceso sin autenticación o con credenciales inválidas.
 */
export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Autenticación requerida.",
    context?: IAppErrorContext
  ) {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      AppErrorCode.AUTHENTICATION_FAILED,
      context
    );
  }
}

/**
 * @function handleError
 * @description Función de utilidad para manejar errores en API Routes de Next.js.
 * Centraliza la lógica de respuesta de error, asegurando un formato consistente.
 * @param {unknown} error - El error capturado.
 * @param {NextApiResponse} res - El objeto de respuesta de la API.
 */
export const handleError = (error: unknown, res: NextApiResponse): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message, // Considerar usar un mensaje genérico o una clave i18n
        code: error.errorCode,
      },
    });
  } else {
    // Si el error no es uno de los nuestros, es un error inesperado.
    logger.fatal(
      { err: error },
      "Ocurrió un error inesperado y no controlado."
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        message: "Ocurrió un error interno en el servidor.",
        code: AppErrorCode.UNKNOWN_ERROR,
      },
    });
  }
};

// src/lib/errors.ts
