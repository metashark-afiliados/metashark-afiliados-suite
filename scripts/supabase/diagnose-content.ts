// scripts/supabase/diagnose-content.ts
import { createClient } from "@supabase/supabase-js";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { loadEnvironment } from "./_utils";

/**
 * @file diagnose-content.ts
 * @description Herramienta de auditoría de contenido. Invoca la RPC
 *              `get_content_diagnostics` y presenta un resumen en consola y en
 *              un archivo JSON. Blindado con guardianes de tipo.
 * @author L.I.A. Legacy & Raz Podestá
 * @version 3.1.0
 * @usage pnpm diag:content
 */
async function main() {
  console.clear();
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
    chalk.cyan(`\n📊 Iniciando censo de contenido en el entorno remoto...`)
  );

  const { data: report, error } = await supabaseAdmin.rpc(
    "get_content_diagnostics"
  );

  if (error) {
    throw new Error(
      `Fallo al ejecutar RPC 'get_content_diagnostics': ${error.message}`
    );
  }

  console.log(chalk.green("✅ Censo de contenido completado."));

  // Renderizar en consola
  console.log(chalk.blueBright.bold(`\n--- CENSO DE ENTIDADES ---`));
  console.table(
    Object.entries(report.entity_counts).map(([Tabla, Registros]) => ({
      Tabla,
      Registros,
    }))
  );

  console.log(chalk.blueBright.bold(`\n--- MÉTRICAS DE RELACIÓN ---`));
  // --- INICIO DE REFACTORIZACIÓN: Guardián de Tipo (TS2339) ---
  console.table(
    Object.entries(report.relationship_metrics).map(([Metrica, Valor]) => ({
      Metrica,
      Valor:
        typeof Valor === "number" && Valor !== null ? Valor.toFixed(2) : "N/A",
    }))
  );
  // --- FIN DE REFACTORIZACIÓN ---

  console.log(chalk.blueBright.bold(`\n--- DISTRIBUCIÓN DE ESTADOS ---`));
  console.log(
    chalk.white("Sitios:"),
    report.status_distribution.sites || { "N/A": 0 }
  );
  console.log(
    chalk.white("Campañas:"),
    report.status_distribution.campaigns || { "N/A": 0 }
  );

  console.log(chalk.blueBright.bold(`\n--- SALUD DEL SISTEMA ---`));
  console.table(
    Object.entries(report.system_health).map(([Metrica, Valor]) => ({
      Metrica,
      Valor,
    }))
  );

  // Persistir en archivo JSON
  const reportDir = path.resolve(process.cwd(), "supabase/reports");
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.resolve(reportDir, `latest-content-diagnostics.json`);

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(
    chalk.blueBright.bold(
      `\n📄 Reporte JSON completo guardado en: ${chalk.yellow(reportPath)}`
    )
  );
}

main()
  .then(() =>
    console.log(chalk.green.bold("\n\n✅ Diagnóstico de contenido completado."))
  )
  .catch((error) => {
    console.error(
      chalk.red.bold("\n🔥 Fallo irrecuperable en el script:"),
      error.message
    );
    process.exit(1);
  });
// scripts/supabase/diagnose-content.ts

