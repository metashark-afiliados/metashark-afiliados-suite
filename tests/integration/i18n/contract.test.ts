/**
 * @file contract.test.ts
 * @description Arnés de pruebas de integración de élite para el contrato de i18n.
 *              Valida que CADA archivo de mensajes atómico en la arquitectura IMAS
 *              cumpla estrictamente con su schema Zod correspondiente.
 * @author Raz Podestá
 * @version 3.0.0
 */
import { readdir, readFile } from "fs/promises";
import path from "path";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { locales } from "@/lib/navigation";

const MESSAGES_DIR = path.resolve(process.cwd(), "src", "messages");
const SCHEMAS_DIR = path.resolve(
  process.cwd(),
  "src",
  "lib",
  "validators",
  "i18n"
);

// Helper para convertir una ruta de archivo a PascalCase para el nombre del schema
const pathToPascalCase = (filePath: string): string => {
  return path
    .basename(filePath, ".json")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

describe("Contrato de Internacionalización (Arquitectura IMAS)", async () => {
  const messageFiles: string[] = [];

  // Descubrir todos los archivos de mensajes atómicos
  const discoverMessageFiles = async (dir: string) => {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.resolve(dir, entry.name);
      if (entry.isDirectory()) {
        await discoverMessageFiles(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        messageFiles.push(fullPath);
      }
    }
  };

  await discoverMessageFiles(MESSAGES_DIR);

  it("debe tener al menos un archivo de mensajes para validar", () => {
    expect(messageFiles.length).toBeGreaterThan(0);
  });

  // Generar una prueba para cada archivo de mensajes descubierto
  for (const messageFilePath of messageFiles) {
    const schemaName = pathToPascalCase(messageFilePath);
    const relativePath = path.relative(process.cwd(), messageFilePath);

    describe(`Contrato para: ${relativePath}`, () => {
      it(`debe cargar el schema y el archivo de mensajes correspondientes`, async () => {
        const schemaPath = path.join(SCHEMAS_DIR, `${schemaName}.schema.ts`);
        const messageFileContent = await readFile(messageFilePath, "utf-8");

        let schemaModule;
        try {
          schemaModule = await import(schemaPath);
        } catch (e) {
          throw new Error(
            `Fallo al cargar el schema en ${schemaPath}. ¿Existe y está nombrado correctamente (${schemaName}.schema.ts)?`
          );
        }

        const zodSchema = schemaModule[
          `${schemaName}Schema`
        ] as z.ZodObject<any>;
        expect(zodSchema).toBeDefined();

        const messages = JSON.parse(messageFileContent);

        for (const locale of locales) {
          const result = zodSchema.safeParse(messages[locale]);
          if (!result.success) {
            console.error(
              `Errores de validación para ${locale} en ${relativePath}:`,
              result.error.flatten()
            );
          }
          expect(
            result.success,
            `El locale '${locale}' en ${relativePath} no cumple el schema.`
          ).toBe(true);
        }
      });
    });
  }
});
