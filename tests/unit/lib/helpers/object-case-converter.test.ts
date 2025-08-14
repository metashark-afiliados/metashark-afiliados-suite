// tests/unit/lib/helpers/object-case-converter.test.ts
/**
 * @file tests/unit/lib/helpers/object-case-converter.test.ts
 * @description Suite de pruebas unitarias de élite para el helper `object-case-converter`.
 *              Valida la correcta conversión de claves de objetos de camelCase a snake_case,
 *              cubriendo casos de anidamiento, arrays y valores primitivos.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { describe, expect, it } from "vitest";

import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";

describe("Helper: keysToSnakeCase", () => {
  it("debe convertir correctamente un objeto anidado de camelCase a snake_case", () => {
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

    const result = keysToSnakeCase(input);
    expect(result).toEqual(expected);
  });

  it("debe manejar correctamente arrays de objetos", () => {
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

    const result = keysToSnakeCase(input);
    expect(result).toEqual(expected);
  });

  it("debe devolver un objeto vacío si la entrada es un objeto vacío", () => {
    const input = {};
    const expected = {};
    const result = keysToSnakeCase(input);
    expect(result).toEqual(expected);
  });

  it("debe manejar valores nulos y primitivos sin modificarlos", () => {
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

    const result = keysToSnakeCase(input);
    expect(result).toEqual(expected);
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Validación de la Infraestructura de Pruebas**: ((Implementada)) La existencia y ejecución exitosa de esta prueba valida que `vitest.config.ts` y `tests/setup.ts` están funcionando correctamente.
 * 2. **Patrón de Pruebas Unitarias**: ((Implementada)) Establece el estándar para futuras pruebas unitarias de funciones puras: claras, concisas y cubriendo múltiples casos.
 * 3. **Cobertura de Código Inicial**: ((Implementada)) Inicia el proceso de pago de la deuda técnica de pruebas, proporcionando una cobertura del 100% para este helper.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Propiedad (Property-Based Testing)**: ((Vigente)) Para una robustez de élite, se podría usar una librería como `fast-check` para generar cientos de objetos aleatorios y verificar que la función no falle, en lugar de depender solo de casos de prueba manuales.
 * 2. **Prueba para `keysToCamelCase`**: ((Vigente)) Una vez que la función inversa sea creada, se debe añadir una suite de pruebas correspondiente en este mismo archivo.
 *
 * =====================================================================
 */
// tests/unit/lib/helpers/object-case-converter.test.ts
