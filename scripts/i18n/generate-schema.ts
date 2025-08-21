// scripts/i18n/generate-schema.ts
/**
 * @file generate-schema.ts
 * @description Script de automatización de élite para la DX. Escanea el
 *              directorio de schemas atómicos de i18n y genera automáticamente
 *              el ensamblador principal `i18n.schema.ts`. Esto garantiza
 *              que la SSoT de los tipos de i18n esté siempre sincronizada.
 * @author Raz Podestá
 * @version 1.0.0
 */
import fs from "fs";
import path from "path";
import chalk from "chalk";

const SCHEMAS_DIR = path.resolve(process.cwd(), "src/lib/validators/i18n");
const OUTPUT_FILE = path.resolve(
  process.cwd(),
  "src/lib/validators/i18n.schema.ts"
);

/**
 * @private
 * @function generateSchemaContent
 * @description Construye el contenido del archivo de schema ensamblador.
 * @param {string[]} schemaImports - Array de sentencias de importación.
 * @param {string[]} schemaEntries - Array de entradas para el objeto Zod.
 * @returns {string} El contenido completo del archivo TypeScript.
 */
function generateSchemaContent(
  schemaImports: string[],
  schemaEntries: string[]
): string {
  const header = `// src/lib/validators/i18n.schema.ts
/**
 * @file i18n.schema.ts
 * @description Manifiesto de Tipos y SSoT para el contrato de i18n.
 *              ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE. NO LO EDITE MANUALMENTE.
 *              Ejecute \`pnpm gen:i18n:schema\` para regenerarlo.
 * @author Script de Generación Automática
 * @version ${new Date().toISOString()}
 */
import { z } from "zod";

// --- Importaciones de Schemas Atómicos (Generado Automáticamente) ---
${schemaImports.join("\n")}

/**
 * @public
 * @constant i18nSchema
 * @description El schema Zod ensamblado que representa la estructura completa
 *              de todos los mensajes de internacionalización.
 */
export const i18nSchema = z.object({
${schemaEntries.join(",\n")}
});

export type MessagesType = z.infer<typeof i18nSchema>;
`;

  return header;
}

/**
 * @public
 * @function main
 * @description Orquesta el proceso de generación del schema.
 */
function main() {
  console.log(chalk.blue("🚀 Iniciando generación del schema Zod de i18n..."));

  try {
    const schemaFiles = fs
      .readdirSync(SCHEMAS_DIR)
      .filter((file) => file.endsWith(".schema.ts"));

    const schemaImports: string[] = [];
    const schemaEntries: string[] = [];

    for (const file of schemaFiles) {
      const baseName = file.replace(".schema.ts", "");
      const schemaName = `${baseName}Schema`;
      // Convención de mapeo: El nombre del namespace es el mismo que el baseName.
      const namespace = baseName;

      schemaImports.push(
        `import { ${schemaName} } from "./i18n/${file.replace(".ts", "")}";`
      );
      schemaEntries.push(`  ${namespace}: ${schemaName}`);
    }

    const fileContent = generateSchemaContent(schemaImports, schemaEntries);
    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    console.log(
      chalk.green(
        `✅ Schema Zod de i18n generado con éxito en ${chalk.yellow(
          "src/lib/validators/i18n.schema.ts"
        )}`
      )
    );
    console.log(
      chalk.cyan(
        `   Total de ${schemaFiles.length} schemas atómicos ensamblados.`
      )
    );
  } catch (error) {
    console.error(
      chalk.red.bold("🔥 Error crítico durante la generación del schema:"),
      error
    );
    process.exit(1);
  }
}

main();

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Automatización de DX**: ((Implementada)) Este script elimina el registro manual de schemas atómicos en el ensamblador principal, previniendo errores de omisión.
 * 2. **Convención sobre Configuración**: ((Implementada)) El script asume una convención de nomenclatura (`[Name].schema.ts` exporta `[Name]Schema`), lo que simplifica la lógica y promueve la consistencia.
 *
 * @subsection Melhorias Futuras
 * 1. **Validación de Namespace**: ((Vigente)) El script podría ser mejorado para leer el `messages/manifest.ts` y advertir si existe un schema atómico sin su correspondiente archivo de mensajes, o viceversa, detectando desincronizaciones completas.
 *
 * =====================================================================
 */
// scripts/i18n/generate-schema.ts
