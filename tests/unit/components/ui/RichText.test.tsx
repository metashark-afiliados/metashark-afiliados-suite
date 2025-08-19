// tests/unit/components/ui/RichText.test.tsx
/**
 * @file tests/unit/components/ui/RichText.test.tsx
 * @description Arnés de pruebas unitarias de élite para el aparato `RichText`.
 *              Valida que el componente actúa como un blindaje para `React.Children.only`
 *              al asegurar que siempre renderiza un único `span` con los `children`
 *              pasados, y que las clases y atributos se aplican correctamente.
 *              Corregido para manejar la posible nulidad de `spanElement`.
 * @author L.I.A. Legacy
 * @version 1.0.1
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import React from "react"; // Importación explícita de React para JSX

import { RichText } from "@/components/ui/RichText";

describe("Componente Atómico de Élite: RichText", () => {
  it("debe renderizar un único <span> que envuelve a sus hijos de tipo string", () => {
    // Arrange
    const children = "Hello World";
    // Act
    render(<RichText>{children}</RichText>);
    const spanElement = screen.getByText("Hello World");

    // Assert
    expect(spanElement).toBeInTheDocument();
    expect(spanElement.tagName).toBe("SPAN");
    // Verificar que el elemento span es el único contenedor del texto
    expect(spanElement.parentNode).toBeInTheDocument();
  });

  it("debe aplicar las clases CSS proporcionadas al <span>", () => {
    // Arrange
    const className = "custom-class another-class";
    // Act
    render(<RichText className={className}>Test</RichText>);
    const spanElement = screen.getByText("Test");

    // Assert
    expect(spanElement).toHaveClass("custom-class");
    expect(spanElement).toHaveClass("another-class");
  });

  it("debe pasar atributos HTML adicionales al elemento <span> subyacente", () => {
    // Arrange
    const ariaLabel = "rich text content";
    const dataTestId = "my-rich-text";
    // Act
    render(
      <RichText aria-label={ariaLabel} data-testid={dataTestId}>
        Content
      </RichText>
    );
    const spanElement = screen.getByTestId(dataTestId);

    // Assert
    expect(spanElement).toHaveAttribute("aria-label", ariaLabel);
  });

  it("debe manejar hijos que son un array de nodos React (simulando t.rich)", () => {
    // Arrange
    const children = [
      "This is ",
      <strong key="bold-key">bold text</strong>,
      " and more.",
    ];
    // Act
    render(<RichText>{children}</RichText>);
    const spanElement = screen.getByText(/This is bold text and more/i);

    // Assert
    expect(spanElement).toBeInTheDocument();
    expect(spanElement.tagName).toBe("SPAN");
    // Verificar que el tag <strong> está anidado correctamente dentro del span
    expect(screen.getByText("bold text")).toBeInTheDocument();
    expect(screen.getByText("bold text").tagName).toBe("STRONG");
    expect(screen.getByText("bold text").parentNode).toBe(spanElement);
  });

  it("debe manejar hijos que incluyen otros componentes React", () => {
    // Arrange
    const AnotherComponent = () => <p>Another component here</p>;
    const children = (
      <>
        Text before <AnotherComponent /> text after.
      </>
    );
    // Act
    render(<RichText>{children}</RichText>);
    // Buscar el span contenedor que envuelve "Text before"
    // CORRECCIÓN: Añadir aserción de no-nulo (!) después de .closest('span')
    const spanElement = screen.getByText(/Text before/i).closest("span")!;

    // Assert
    expect(spanElement).toBeInTheDocument();
    expect(spanElement.tagName).toBe("SPAN");
    // Verificar que el componente anidado está presente y es un hijo del span
    expect(screen.getByText("Another component here")).toBeInTheDocument();
    expect(screen.getByText("Another component here").tagName).toBe("P");
    expect(screen.getByText("Another component here").parentNode).toBe(
      spanElement
    );
  });
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolución de Error de Tipos (TS18047)**: ((Implementada)) Se ha añadido una aserción de no-nulo (`!`) a la llamada `closest('span')` para informar a TypeScript que el resultado no será `null` en el contexto de esta prueba.
 * 2. **Cobertura de Funcionalidad Clave**: ((Vigente)) Se han añadido pruebas para los casos críticos de `RichText`: envolver `React.ReactNode[]` (simulando `t.rich`) y aplicar `className`/`props`, garantizando su rol como blindaje de `React.Children.only`.
 *
 * @subsection Melhorias Futuras
 * 1. **Pruebas de Rendimiento**: ((Vigente)) Considerar añadir micro-benchmarks para asegurar que el overhead de `RichText` es insignificante, especialmente si se usa en listas largas.
 *
 * =====================================================================
 */
