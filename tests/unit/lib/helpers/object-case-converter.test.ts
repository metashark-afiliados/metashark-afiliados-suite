// tests/unit/lib/helpers/object-case-converter.test.ts
/**
 * @file tests/unit/lib/helpers/object-case-converter.test.ts
 * @description Suite de pruebas unitarias de élite para el helper `object-case-converter`.
 *              Valida la correcta conversión de claves de objetos de camelCase a snake_case,
 *              cubriendo casos de anidamiento, arrays y valores primitivos.
 * @author Raz Podestá
 * @version 1.1.0
 */
import { describe, expect, it } from "vitest";

import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";

describe("Arnés de Pruebas Unitarias: lib/helpers/object-case-converter", () => {
  it("debe convertir correctamente un objeto anidado de camelCase a snake_case", () => {
    // Arrange
    const input = {
      userId: 1,
      userProfile: {
        firstName: "John",
        lastName: "Doe",
        contactInfo: {
          emailAddress: "john.doe@example.com",
        },
      },
    };

    const expected = {
      user_id: 1,
      user_profile: {
        first_name: "John",
        last_name: "Doe",
        contact_info: {
          email_address: "john.doe@example.com",
        },
      },
    };

    // Act
    const result = keysToSnakeCase(input);

    // Assert
    expect(result).toEqual(expected);
  });

  it("debe manejar correctamente arrays de objetos", () => {
    // Arrange
    const input = {
      items: [
        { itemId: 101, itemName: "Item A" },
        { itemId: 102, itemName: "Item B" },
      ],
    };

    const expected = {
      items: [
        { item_id: 101, item_name: "Item A" },
        { item_id: 102, item_name: "Item B" },
      ],
    };

    // Act
    const result = keysToSnakeCase(input);

    // Assert
    expect(result).toEqual(expected);
  });

  it("debe devolver un objeto vacío si la entrada es un objeto vacío", () => {
    // Arrange
    const input = {};
    const expected = {};

    // Act
    const result = keysToSnakeCase(input);

    // Assert
    expect(result).toEqual(expected);
  });

  it("debe manejar valores nulos y primitivos sin modificarlos", () => {
    // Arrange
    const input = {
      aString: "hello",
      aNumber: 42,
      aNull: null,
      isTrue: true,
    };

    const expected = {
      a_string: "hello",
      a_number: 42,
      a_null: null,
      is_true: true,
    };

    // Act
    const result = keysToSnakeCase(input);

    // Assert
    expect(result).toEqual(expected);
  });

  it("debe manejar claves con múltiples mayúsculas consecutivas", () => {
    // Arrange
    const input = {
      anHTTPAction: "POST",
    };
    const expected = {
      an_h_t_t_p_action: "POST",
    };

    // Act
    const result = keysToSnakeCase(input);

    // Assert
    expect(result).toEqual(expected);
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Cobertura de Casos Borde**: ((Implementada)) Se ha añadido una prueba para claves con múltiples mayúsculas (`anHTTPAction`), mejorando la robustez de la validación.
 * 2. **Estándar de Pruebas Unitarias**: ((Implementada)) Establece el estándar para futuras pruebas de funciones puras: claras, concisas y cubriendo múltiples escenarios.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas para `keysToCamelCase`**: ((Vigente)) Una vez que la función inversa sea creada, se debe añadir una suite de pruebas correspondiente en este mismo archivo.
 * 2. **Pruebas de Propiedad (Property-Based Testing)**: ((Vigente)) Para una robustez de élite, usar una librería como `fast-check` para generar cientos de objetos aleatorios y verificar que la función no falle.
 *
 * =====================================================================
 */
// tests/unit/lib/helpers/object-case-converter.test.ts
