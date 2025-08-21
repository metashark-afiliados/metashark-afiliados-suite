// tests/unit/lib/utils/text.test.ts
/**
 * @file tests/unit/lib/utils/text.test.ts
 * @description Arnés de pruebas unitarias de élite para el aparato `slugify`.
 *              Valida todos los casos de uso, incluyendo la normalización de
 *              espacios, la transliteración de caracteres acentuados y la
 *              eliminación de caracteres especiales.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/utils/text";

describe("Aparato de Utilidad Atómico: slugify", () => {
  it("debe convertir espacios a guiones y poner en minúsculas", () => {
    // Arrange
    const input = "Hola Mundo de Prueba";
    const expected = "hola-mundo-de-prueba";

    // Act
    const result = slugify(input);

    // Assert
    expect(result).toBe(expected);
  });

  it("debe remover caracteres acentuados y especiales", () => {
    // Arrange
    const input = "Crème Brûlée & mañana por la noche!";
    const expected = "creme-brulee-and-manana-por-la-noche";

    // Act
    const result = slugify(input);

    // Assert
    expect(result).toBe(expected);
  });

  it("debe manejar múltiples guiones y espacios consecutivos", () => {
    // Arrange
    const input = "Un -- Test   con---espacios";
    const expected = "un-test-con-espacios";

    // Act
    const result = slugify(input);

    // Assert
    expect(result).toBe(expected);
  });

  it("debe eliminar guiones al principio y al final del string", () => {
    // Arrange
    const input = "-Un string que empieza y termina con guion-";
    const expected = "un-string-que-empieza-y-termina-con-guion";

    // Act
    const result = slugify(input);

    // Assert
    expect(result).toBe(expected);
  });

  it("debe devolver un string vacío si la entrada es vacía", () => {
    // Arrange
    const input = "";
    const expected = "";

    // Act
    const result = slugify(input);

    // Assert
    expect(result).toBe(expected);
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cobertura de Pruebas de Élite**: ((Implementada)) Se han cubierto los casos de uso principales y los casos borde para la función `slugify`, garantizando su robustez.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas Parametrizadas**: ((Vigente)) Utilizar `it.each` de Vitest para combinar múltiples casos de prueba en una estructura más concisa y mantenible.
 *
 * =====================================================================
 */
// tests/unit/lib/utils/text.test.ts
