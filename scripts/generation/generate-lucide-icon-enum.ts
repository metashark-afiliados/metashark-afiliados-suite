// scripts/generation/generate-lucide-icon-enum.ts
/**
 * @file generate-lucide-icon-enum.ts
 * @description Script de automatización de élite para la DX. Lee la SSoT
 *              de iconos de lucide-react y genera un schema de Zod.
 * @author L.I.A. Legacy
 * @version 1.1.0 (Regex Fix)
 */
import fs from "fs";
import path from "path";
import chalk from "chalk";

const LUCIDE_MANIFEST_PATH = path.resolve(
  process.cwd(),
  "node_modules/lucide-react/dynamicIconImports.js"
);
const OUTPUT_FILE = path.resolve(
  process.cwd(),
  "src/config/lucide-icon-names.ts"
);

/**
 * Convierte una cadena de kebab-case a PascalCase.
 * @param str - La cadena en kebab-case.
 * @returns La cadena en PascalCase.
 */
function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function main() {
  console.log(
    chalk.blue("🚀 Iniciando generación del Zod Enum para iconos de Lucide...")
  );

  try {
    if (!fs.existsSync(LUCIDE_MANIFEST_PATH)) {
      throw new Error(
        `No se encontró el manifiesto de Lucide en la ruta esperada: ${LUCIDE_MANIFEST_PATH}`
      );
    }

    const manifestContent = fs.readFileSync(LUCIDE_MANIFEST_PATH, "utf-8");

    // --- CORRECCIÓN CRÍTICA DE PARSEO ---
    // La expresión regular ahora busca claves envueltas en comillas DOBLES.
    const iconKeysMatches = manifestContent.matchAll(/"([^"]+)":/g);
    const iconKeys = Array.from(iconKeysMatches, (m) => m[1]);
    // --- FIN DE CORRECCIÓN ---

    if (iconKeys.length === 0) {
      throw new Error(
        "No se encontraron claves de iconos en el manifiesto de Lucide."
      );
    }

    const pascalCaseIconNames = iconKeys.map(kebabToPascal);

    const fileContent = `// src/config/lucide-icon-names.ts
/**
 * @file lucide-icon-names.ts
 * @description Manifiesto de Nombres de Iconos de Lucide y SSoT.
 *              ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE. NO LO EDITE MANUALMENTE.
 *              Ejecute 'pnpm gen:icons' para actualizarlo.
 * @author Script de Generación Automática
 * @version ${new Date().toISOString()}
 */
import { z } from 'zod';

export const lucideIconNames = ${JSON.stringify(pascalCaseIconNames, null, 2)} as const;

export const LucideIconNameSchema = z.enum(lucideIconNames);
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    console.log(
      chalk.green(
        `✅ Zod Enum generado con éxito en ${chalk.yellow(
          "src/config/lucide-icon-names.ts"
        )}`
      )
    );
    console.log(
      chalk.cyan(
        `   Total de ${pascalCaseIconNames.length} iconos registrados.`
      )
    );
  } catch (error) {
    console.error(
      chalk.red.bold("🔥 Error crítico durante la generación del enum:"),
      error
    );
    process.exit(1);
  }
}

main();
