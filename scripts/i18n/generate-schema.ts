// scripts/i18n/generate-schema.ts
/**
 * @file generate-schema.ts
 * @description Script de automatización de élite para la DX. Escanea el
 *              directorio de schemas atómicos de i18n y genera automáticamente
 *              el ensamblador principal `i18n.schema.ts`. Este script construye
 *              un objeto Zod aplanado, donde cada clave es el namespace completo,
 *              resolviendo sistémicamente los problemas de inferencia de tipos.
 * @author Raz Podestá - MetaShark Tech
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
const MANIFEST_FILE = path.resolve(process.cwd(), "src/messages/manifest.ts");

/**
 * @private
 * @function getNamespacesFromManifest
 * @description Lee el manifiesto de mensajes para extraer los namespaces canónicos.
 * @returns {string[]} Un array de namespaces.
 */
function getNamespacesFromManifest(): string[] {
  const manifestContent = fs.readFileSync(MANIFEST_FILE, "utf-8");
  const namespaceRegex = /"([^"]+)": \(\) => import/g;
  const matches = manifestContent.matchAll(namespaceRegex);
  return Array.from(matches, (m) => m[1]);
}

/**
 * @private
 * @function generateSchemaContent
 * @description Construye el contenido del archivo de schema ensamblador.
 * @param {string[]} imports - Array de sentencias de importación.
 * @param {string[]} entries - Array de entradas para el objeto Zod.
 * @returns {string} El contenido completo del archivo TypeScript.
 */
function generateSchemaContent(imports: string[], entries: string[]): string {
  return `// src/lib/validators/i18n.schema.ts
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
${imports.join("\n")}

/**
 * @public
 * @constant i18nSchema
 * @description El schema Zod aplanado que representa la estructura completa
 *              de todos los mensajes de internacionalización.
 */
export const i18nSchema = z.object({
${entries.join(",\n")}
});

export type Messages = z.infer<typeof i18nSchema>;
`;
}

/**
 * @public
 * @function main
 * @description Orquesta el proceso de generación del schema.
 */
function main() {
  console.log(chalk.blue("🚀 Iniciando generación del schema Zod de i18n..."));

  try {
    const namespaces = getNamespacesFromManifest();
    const imports: string[] = [];
    const entries: string[] = [];
    const importedSchemas = new Set<string>();

    for (const ns of namespaces) {
      // Convierte el namespace a una ruta de archivo de schema (convención)
      const schemaName = ns.split(".").pop() + "Schema";
      const schemaPath = `./i18n/${ns.split(".").pop()}.schema`;

      if (!importedSchemas.has(schemaName)) {
        imports.push(`import { ${schemaName} } from "${schemaPath}";`);
        importedSchemas.add(schemaName);
      }

      entries.push(`  "${ns}": ${schemaName}`);
    }

    const fileContent = generateSchemaContent(imports, entries);
    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    console.log(
      chalk.green(
        `✅ Schema Zod aplanado generado con éxito en ${chalk.yellow(
          "src/lib/validators/i18n.schema.ts"
        )}`
      )
    );
    console.log(
      chalk.cyan(`   Total de ${namespaces.length} namespaces registrados.`)
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
