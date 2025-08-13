// scripts/supabase/_utils.ts
/**
 * @file _utils.ts
 * @description Helper de utilidad compartido para los scripts de diagnóstico de Supabase.
 *              Carga y valida las variables de entorno desde el archivo canónico `.env.local`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import chalk from "chalk";
import dotenv from "dotenv";
import path from "path";

/**
 * @public
 * @function loadEnvironment
 * @description Carga las variables de entorno desde `.env.local` y valida que
 *              todas las claves requeridas para los scripts de Supabase estén presentes.
 * @throws {Error} Si el archivo de entorno no se encuentra o faltan variables críticas.
 */
export function loadEnvironment(): void {
  const envFile = ".env.local";
  const envPath = path.resolve(process.cwd(), envFile);
  console.log(
    chalk.gray(
      `🔌 Cargando variables de entorno desde: ${chalk.yellow(envFile)}`
    )
  );

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error(
      chalk.red.bold(`❌ [ERROR CRÍTICO] Archivo de entorno no encontrado.`)
    );
    console.error(
      chalk.white(
        `Asegúrate de que el archivo ${chalk.yellow(
          envFile
        )} exista en la raíz del proyecto.`
      )
    );
    throw new Error(`No se pudo cargar el archivo de entorno: ${envFile}.`);
  }

  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_DB_URL",
  ];
  const missingVars = requiredVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0) {
    console.error(
      chalk.red.bold(
        `❌ [ERROR CRÍTICO] Variables de entorno requeridas no definidas.`
      )
    );
    console.error(
      chalk.white(
        `Las siguientes variables deben estar definidas en tu archivo ${chalk.yellow(
          envFile
        )}:`
      )
    );
    missingVars.forEach((v) => console.error(chalk.yellow(`  - ${v}`)));
    throw new Error(
      "Configuración de entorno incompleta. Faltan variables críticas."
    );
  }

  console.log(chalk.green("✅ Variables de entorno cargadas y validadas."));
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estabilización de Scripts**: ((Implementada)) La restauración de este archivo resuelve el error de compilación `TS2307` en `diagnose-schema.ts`, haciendo que nuestras herramientas de diagnóstico vuelvan a ser funcionales.
 *
 * =====================================================================
 */
// scripts/supabase/_utils.ts
