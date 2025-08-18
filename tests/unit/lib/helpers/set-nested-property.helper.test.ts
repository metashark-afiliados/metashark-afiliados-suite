// tests/unit/lib/helpers/set-nested-property.helper.test.ts
/**
 * @file set-nested-property.helper.test.ts
 * @description Arnés de pruebas unitarias de élite para el helper `setNestedProperty`.
 *              Valida la correcta asignación de valores a propiedades anidadas.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { describe, expect, it } from "vitest";

import { setNestedProperty } from "@/lib/helpers/set-nested-property.helper";

describe("Helper Atómico: setNestedProperty", () => {
  it("debe asignar un valor a una propiedad de primer nivel", () => {
    const obj = {};
    setNestedProperty(obj, "a", 1);
    expect(obj).toEqual({ a: 1 });
  });

  it("debe asignar un valor a una propiedad anidada creando los objetos intermedios", () => {
    const obj = {};
    setNestedProperty(obj, "a.b.c", "valor");
    expect(obj).toEqual({ a: { b: { c: "valor" } } });
  });

  it("debe sobreescribir una propiedad existente", () => {
    const obj = { a: { b: 1 } };
    setNestedProperty(obj, "a.b", 2);
    expect(obj).toEqual({ a: { b: 2 } });
  });

  it("debe manejar un objeto inicial no vacío", () => {
    const obj = { x: "y" };
    setNestedProperty(obj, "a.b", "z");
    expect(obj).toEqual({ x: "y", a: { b: "z" } });
  });
});
/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Arnés de Pruebas Unitarias**: ((Implementada)) Se ha creado una suite de pruebas para esta utilidad crítica, garantizando su comportamiento correcto y previniendo regresiones.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Casos Borde**: ((Vigente)) Añadir pruebas para manejar rutas vacías o inválidas.
 *
 * =====================================================================
 */
// tests/unit/lib/helpers/set-nested-property.helper.test.ts
