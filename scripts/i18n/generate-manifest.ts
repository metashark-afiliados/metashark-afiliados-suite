// scripts/i18n/generate-manifest.ts
/**
 * @file generate-manifest.ts
 * @description Script de automatización de élite para la Experiencia de Desarrollador (DX).
 *              Escanea recursivamente el directorio `src/messages` y genera
 *              automáticamente el manifiesto de importación dinámica `src/messages/manifest.ts`.
 *              Esto elimina la necesidad de registro manual y previene errores
 *              de `MISSING_MESSAGE` por omisión.
 * @author Raz Podestá
 * @version 1.0.0
 */
import fs from "fs";
import path from "path";
import chalk from "chalk";

const MESSAGES_DIR = path.resolve(process.cwd(), "src/messages");
const OUTPUT_FILE = path.resolve(MESSAGES_DIR, "manifest.ts");

/**
 * @private
 * @function walkDir
 * @description Recorre recursivamente un directorio para encontrar todos los archivos .json.
 * @param {string} dir - El directorio a escanear.
 * @returns {string[]} Un array de rutas de archivo completas.
 */
function walkDir(dir: string): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files = [...files, ...walkDir(fullPath)];
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * @private
 * @function generateManifestContent
 * @description Construye el contenido del archivo de manifiesto como una cadena de texto.
 * @param {Record<string, string>} manifestObject - El objeto que mapea namespaces a rutas de importación.
 * @returns {string} El contenido completo del archivo TypeScript.
 */
function generateManifestContent(
  manifestObject: Record<string, string>
): string {
  const header = `// src/messages/manifest.ts
/**
 * @file manifest.ts
 * @description Manifiesto de Importación Dinámica.
 *              ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE. NO LO EDITE MANUALMENTE.
 *              Ejecute \`pnpm gen:i18n:manifest\` para regenerarlo.
 * @author Script de Generación Automática
 * @version ${new Date().toISOString()}
 */
import { type ManifestModule } from "./types";

export const messagesManifest: Record<string, ManifestModule> = {`;

  const footer = `};
`;

  const entries = Object.entries(manifestObject)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `  "${key}": ${value},`)
    .join("\n");

  return `${header}\n${entries}\n${footer}`;
}

/**
 * @public
 * @function main
 * @description Orquesta el proceso de generación del manifiesto.
 */
function main() {
  console.log(chalk.blue("🚀 Iniciando generación del manifiesto de i18n..."));

  try {
    const jsonFiles = walkDir(MESSAGES_DIR);
    const manifestObject: Record<string, string> = {};

    for (const file of jsonFiles) {
      const relativePath = path.relative(MESSAGES_DIR, file);
      // Normalizar separadores de ruta para consistencia entre OS
      const normalizedPath = relativePath.replace(/\\/g, "/");

      if (normalizedPath === "manifest.ts") continue;

      const namespace = normalizedPath
        .replace(/\.json$/, "")
        .replace(/\//g, ".");

      const importPath = `./${normalizedPath}`;
      manifestObject[namespace] = `() => import("${importPath}")`;
    }

    const fileContent = generateManifestContent(manifestObject);
    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    console.log(
      chalk.green(
        `✅ Manifiesto generado con éxito en ${chalk.yellow(
          "src/messages/manifest.ts"
        )}`
      )
    );
    console.log(
      chalk.cyan(
        `   Total de ${Object.keys(manifestObject).length} namespaces registrados.`
      )
    );
  } catch (error) {
    console.error(
      chalk.red.bold("🔥 Error crítico durante la generación del manifiesto:"),
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
 * 1. **Automatización de DX**: ((Implementada)) Este script automatiza una tarea manual repetitiva y propensa a errores, mejorando la experiencia del desarrollador y la robustez del sistema de i18n.
 * 2. **SSoT Basada en Archivos**: ((Implementada)) El manifiesto generado se convierte en un reflejo exacto de la estructura de archivos, que es la verdadera SSoT.
 *
 * @subsection Melhorias Futuras
 * 1. **Integración con Hooks de Git**: ((Vigente)) Este script podría ser ejecutado automáticamente antes de cada `commit` a través de un hook de `husky` para asegurar que el manifiesto esté siempre sincronizado.
 *
 * =====================================================================
 */
// scripts/i18n/generate-manifest.ts
