// tests/unit/lib/helpers/object-case-converter.test.ts
/**
 * @file tests/unit/lib/helpers/object-case-converter.test.ts
 * @description Arnés de pruebas unitarias de élite para el aparato `keysToSnakeCase`.
 *              Valida la conversión recursiva de claves en objetos planos, anidados
 *              y arrays de objetos, incluyendo la validación de inmutabilidad para
 *              garantizar que la función es pura.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { describe, expect, it } from "vitest";

import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";

describe("Aparato de Utilidad Atómico: keysToSnakeCase", () => {
  it("debe convertir las claves de un objeto plano a snake_case", () => {
    // Arrange
    const input = { simpleKey: "value", anotherKey: 123 };
    const expected = { simple_key: "value", another_key: 123 };

    // Act
    const result = keysToSnakeCase(input);

    // Assert
    expect(result).toEqual(expected);
  });

  it("debe convertir recursivamente las claves en objetos anidados", () => {
    // Arrange
    const input = {
      userProfile: { firstName: "John", lastName: "Doe" },
      isActive: true,
    };
    const expected = {
      user_profile: { first_name: "John", last_name: "Doe" },
      is_active: true,
    };

    // Act
    const result = keysToSnakeCase(input);

    // Assert
    expect(result).toEqual(expected);
  });

  it("debe convertir recursivamente las claves en un array de objetos", () => {
    // Arrange
    const input = {
      itemsList: [
        { itemId: 1 },
        { itemId: 2, itemDetails: { priceAmount: 99 } },
      ],
    };
    const expected = {
      items_list: [
        { item_id: 1 },
        { item_id: 2, item_details: { price_amount: 99 } },
      ],
    };

    // Act
    const result = keysToSnakeCase(input);

    // Assert
    expect(result).toEqual(expected);
  });

  it("debe manejar correctamente valores null y undefined sin modificarlos", () => {
    // Arrange
    const input = { aKey: null, anotherKey: undefined };
    const expected = { a_key: null, another_key: undefined };

    // Act
    const result = keysToSnakeCase(input);

    // Assert
    expect(result).toEqual(expected);
  });

  it("debe devolver el valor original si no es un objeto o array", () => {
    // Arrange
    const inputString = "Just a string";
    const inputNumber = 42;

    // Act
    const resultString = keysToSnakeCase(inputString as any);
    const resultNumber = keysToSnakeCase(inputNumber as any);

    // Assert
    expect(resultString).toBe(inputString);
    expect(resultNumber).toBe(inputNumber);
  });

  it("debe ser una función pura y no mutar el objeto original", () => {
    // Arrange
    const originalObject = { userProfile: { firstName: "Jane" } };
    const originalObjectCopy = JSON.parse(JSON.stringify(originalObject));

    // Act
    keysToSnakeCase(originalObject);

    // Assert
    expect(originalObject).toEqual(originalObjectCopy);
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cobertura de Casos Borde**: ((Implementada)) Las pruebas cubren no solo objetos simples, sino también objetos anidados, arrays de objetos y valores primitivos, garantizando la robustez del helper.
 * 2. **Validación de Inmutabilidad**: ((Implementada)) Se ha añadido una prueba explícita para asegurar que la función es pura y no modifica el objeto de entrada, un principio fundamental de la programación funcional y del diseño de élite.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas para `keysToCamelCase`**: ((Vigente)) Cuando se implemente la función inversa, este arnés deberá ser expandido para incluir una suite de pruebas completa para ella.
 * 2. **Pruebas de Rendimiento**: ((Vigente)) Para un helper de uso intensivo, se podría añadir un benchmark (`vitest.bench`) para medir su rendimiento con objetos muy grandes y profundamente anidados.
 *
 * =====================================================================
 */
// tests/unit/lib/helpers/object-case-converter.test.ts
