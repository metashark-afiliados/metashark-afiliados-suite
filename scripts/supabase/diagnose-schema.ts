// scripts/supabase/diagnose-schema.ts
import { createClient } from "@supabase/supabase-js";
import chalk from "chalk";

import { loadEnvironment } from "./_utils";

/**
 * @file diagnose-schema.ts
 * @description Herramienta de auditoría de sistema de élite. Invoca la RPC
 *              `get_system_diagnostics` para realizar una radiografía completa del
 *              esquema, RLS, funciones y triggers de la base de datos remota.
 * @author Raz Podestá
 * @version 1.0.0
 * @usage pnpm diag:all
 */
const printSection = (title: string) =>
  console.log(
    `\n\n${chalk.blue("=".repeat(80))}\n${chalk.blueBright.bold(
      `🚀 DIAGNÓSTICO: ${title.toUpperCase()}`
    )}\n${chalk.blue("=".repeat(80))}`
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
  // Asumimos que la RPC 'get_system_diagnostics' existe en su base de datos.
  const { data, error } = await supabaseAdmin.rpc("get_system_diagnostics");

  if (error) {
    throw new Error(
      `Fallo al ejecutar RPC 'get_system_diagnostics': ${error.message}`
    );
  }

  console.log(
    chalk.green("✅ RPC 'get_system_diagnostics' ejecutada con éxito.")
  );

  console.log(chalk.white('\n--- Columnas del Esquema "public" ---'));
  console.table(data.schema_columns || []);

  console.log(chalk.white("\n--- Políticas de Seguridad (RLS) ---"));
  console.table(data.rls_policies || []);

  console.log(chalk.white("\n--- Funciones (Routines) ---"));
  console.table(data.routines || []);

  console.log(chalk.white("\n--- Triggers (public & auth) ---"));
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
 * 1. **Funcionalidad Restaurada**: ((Implementada)) Se ha restaurado la lógica funcional del snapshot original, que utiliza la RPC `get_system_diagnostics` para una auditoría completa.
 * 2. **Visibilidad Mejorada**: ((Implementada)) La auditoría de triggers ahora incluye el esquema `auth`, proporcionando una visión más completa de la automatización de la base de datos.
 *
 * @subsection Melhorias Futuras
 * 1. **Generación de Informes**: ((Vigente)) La salida de `console.table` podría ser escrita a un archivo `.md` para un registro persistente y fácil de compartir.
 *
 * =====================================================================
 */
// scripts/supabase/diagnose-schema.ts
