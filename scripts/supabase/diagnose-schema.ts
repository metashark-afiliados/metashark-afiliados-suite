// scripts/supabase/diagnose-all.ts
/**
 * @file diagnose-all.ts
 * @description Herramienta de auditoría de sistema de élite. Reconstruido a su
 *              estado canónico original. Este script invoca la RPC `get_system_diagnostics`
 *              para realizar una radiografía completa del esquema, RLS, funciones y
 *              triggers de la base de datos remota, mostrando los resultados en la consola.
 * @author Raz Podestá
 * @version 2.0.0
 * @usage pnpm diag:all
 */
import { createClient } from "@supabase/supabase-js";
import chalk from "chalk";

import { loadEnvironment } from "./_utils";

const printSection = (title: string) =>
  console.log(
    `\n\n${chalk.blue("=".repeat(80))}\n${chalk.blueBright.bold(`🚀 DIAGNÓSTICO: ${title.toUpperCase()}`)}\n${chalk.blue("=".repeat(80))}`
  );

async function main() {
  loadEnvironment();

  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Variables de Supabase no definidas en .env.local");
  }

  const supabaseAdmin = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

  console.log(
    chalk.cyan(
      `\n🔬 Iniciando auditoría en el entorno remoto definido en .env.local...`
    )
  );

  printSection("Radiografía del Sistema (Esquema, RLS, Funciones y Triggers)");
  const { data, error } = await supabaseAdmin.rpc("get_system_diagnostics");

  if (error) {
    throw new Error(
      `Fallo al ejecutar RPC 'get_system_diagnostics': ${error.message}`
    );
  }

  console.log(
    chalk.green("✅ RPC 'get_system_diagnostics' ejecutada con éxito.")
  );

  console.log(chalk.white("\n--- Columnas del Esquema 'public' ---"));
  console.table(data.schema_columns || []);

  console.log(chalk.white("\n--- Políticas de Seguridad (RLS) ---"));
  console.table(data.rls_policies || []);

  console.log(chalk.white("\n--- Funciones (Routines) ---"));
  console.table(data.routines || []);

  console.log(chalk.white("\n--- Triggers ---"));
  console.table(data.triggers || []);
}

main()
  .then(() =>
    console.log(chalk.green.bold("\n\n✅ Auditoría del sistema completada."))
  )
  .catch((error) => {
    console.error(
      chalk.red.bold("\n🔥 Fallo irrecuperable en el script:"),
      error.message
    );
    process.exit(1);
  });

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Funcionalidad Restaurada**: ((Implementada)) Se ha restaurado la lógica del script a su versión original y funcional, que utiliza la RPC `get_system_diagnostics`. Esto nos proporciona una herramienta de auditoría fiable.
 * 2. **Cero Regresiones**: ((Implementada)) Esta versión es una reconstrucción fiel del blueprint canónico, garantizando que no se pierda la capacidad de diagnóstico original.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación de Informes**: ((Vigente)) La versión no funcional intentaba generar un informe en Markdown. Esta es una buena característica que se puede reintroducir en este script, escribiendo la salida de `console.table` en un archivo `.md` para un registro persistente.
 *
 * =====================================================================
 */
// scripts/supabase/diagnose-all.ts
